import { InvalidTransactionAmountError } from '../errors/DomainError';
import { Money } from '../value-objects/Money';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TransactionStatus = 'POSTED' | 'VOID';

export interface TransactionProps {
  id: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: Money;
  concept: string;
  date: Date;
  status: TransactionStatus;
  accountName?: string;
  categoryName?: string;
  categoryIcon?: string;
}

export class Transaction {
  private readonly props: TransactionProps;

  public constructor(props: TransactionProps) {
    if (!props.id.trim()) {
      throw new Error('El identificador del movimiento es obligatorio.');
    }
    if (!props.accountId.trim()) {
      throw new Error('La cuenta asociada es obligatoria.');
    }
    if (!props.categoryId.trim()) {
      throw new Error('La categoría asociada es obligatoria.');
    }
    if (!props.concept.trim()) {
      throw new Error('El concepto del movimiento es obligatorio.');
    }
    // Invariante contable #2 de ledger-invariants.md:
    // Ninguna transacción puede tener importe menor o igual a 0
    if (props.amount.minorUnits <= 0) {
      throw new InvalidTransactionAmountError();
    }
    this.props = Object.freeze({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get concept(): string {
    return this.props.concept;
  }

  get date(): Date {
    return this.props.date;
  }

  get status(): TransactionStatus {
    return this.props.status;
  }

  get accountName(): string | undefined {
    return this.props.accountName;
  }

  get categoryName(): string | undefined {
    return this.props.categoryName;
  }

  get categoryIcon(): string | undefined {
    return this.props.categoryIcon;
  }

  public isPosted(): boolean {
    return this.props.status === 'POSTED';
  }
}
