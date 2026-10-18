import { ITransactionRepository, TransactionFilters } from '../../domain/repositories/ITransactionRepository';
import { TransactionDTO } from '../dtos/financial.dtos';

export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  public async execute(filters?: TransactionFilters): Promise<TransactionDTO[]> {
    const transactions = await this.transactionRepository.findAll(filters);
    return transactions.map((tx) => ({
      id: tx.id,
      accountId: tx.accountId,
      accountName: tx.accountName ?? 'Cuenta',
      categoryId: tx.categoryId,
      categoryName: tx.categoryName ?? 'General',
      categoryIcon: tx.categoryIcon ?? 'Tag',
      type: tx.type,
      amountCents: tx.amount.minorUnits,
      amountDecimal: tx.amount.toDecimal(),
      amountFormatted: tx.amount.format(),
      concept: tx.concept,
      dateIso: tx.date.toISOString(),
      status: tx.status,
    }));
  }
}
