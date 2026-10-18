import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { AccountDTO } from '../dtos/financial.dtos';

export class GetAccountsUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  public async execute(): Promise<AccountDTO[]> {
    const accounts = await this.accountRepository.findAll();
    return accounts.map((acc) => ({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      typeLabel: acc.typeLabel,
      bank: acc.bank,
      accountNumber: acc.accountNumber,
      lastFourDigits: acc.lastFourDigits,
      balanceCents: acc.balance.minorUnits,
      balanceDecimal: acc.balance.toDecimal(),
      balanceFormatted: acc.balance.format(),
      currency: acc.balance.currency,
      color: acc.color,
      icon: acc.icon,
    }));
  }
}
