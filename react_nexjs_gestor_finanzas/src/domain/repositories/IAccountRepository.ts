import { Account } from '../entities/Account';

export interface IAccountRepository {
  findAll(): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
}
