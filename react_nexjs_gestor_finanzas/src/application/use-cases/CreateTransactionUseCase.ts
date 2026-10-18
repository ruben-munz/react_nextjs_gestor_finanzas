import { Transaction, TransactionType } from '../../domain/entities/Transaction';
import { EntityNotFoundError } from '../../domain/errors/DomainError';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { Money } from '../../domain/value-objects/Money';

export interface CreateTransactionInput {
  id?: string;
  accountId: string;
  categoryId: string;
  type: Extract<TransactionType, 'INCOME' | 'EXPENSE'>;
  amountCents: number;
  concept: string;
  date?: Date;
}

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  public async execute(input: CreateTransactionInput): Promise<{ transactionId: string; newBalanceCents: number }> {
    const account = await this.accountRepository.findById(input.accountId);
    if (!account) {
      throw new EntityNotFoundError('Cuenta', input.accountId);
    }

    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new EntityNotFoundError('Categoría', input.categoryId);
    }

    const amount = Money.fromMinorUnits(input.amountCents, 'EUR');
    const txId = input.id ?? `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const transaction = new Transaction({
      id: txId,
      accountId: account.id,
      categoryId: category.id,
      type: input.type,
      amount,
      concept: input.concept.trim(),
      date: input.date ?? new Date(),
      status: 'POSTED',
      accountName: account.name,
      categoryName: category.name,
      categoryIcon: category.icon,
    });

    const updatedAccount = input.type === 'INCOME' ? account.credit(amount) : account.debit(amount);

    await this.transactionRepository.createWithAccountBalanceUpdate(transaction, updatedAccount);

    return {
      transactionId: transaction.id,
      newBalanceCents: updatedAccount.balance.minorUnits,
    };
  }
}
