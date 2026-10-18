import { Account } from '../entities/Account';
import { Transaction, TransactionType } from '../entities/Transaction';

export interface TransactionFilters {
  accountId?: string;
  type?: TransactionType;
  search?: string;
  limit?: number;
}

export interface ITransactionRepository {
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  createWithAccountBalanceUpdate(transaction: Transaction, updatedAccount: Account): Promise<void>;
}
