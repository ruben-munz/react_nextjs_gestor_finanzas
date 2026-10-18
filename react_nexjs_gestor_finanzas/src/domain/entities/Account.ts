import { Money } from '../value-objects/Money';

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CASH';

export interface AccountProps {
  id: string;
  name: string;
  type: AccountType;
  bank: string;
  balance: Money;
  color: string;
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Account {
  private readonly props: AccountProps;

  public constructor(props: AccountProps) {
    if (!props.id.trim()) {
      throw new Error('El identificador de la cuenta es obligatorio.');
    }
    if (!props.name.trim()) {
      throw new Error('El nombre de la cuenta es obligatorio.');
    }
    if (!props.bank.trim()) {
      throw new Error('El banco o entidad de la cuenta es obligatorio.');
    }
    this.props = Object.freeze({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): AccountType {
    return this.props.type;
  }

  get typeLabel(): string {
    const labels: Record<AccountType, string> = {
      CHECKING: 'Corriente',
      SAVINGS: 'Ahorro',
      CASH: 'Efectivo',
    };
    return labels[this.props.type];
  }

  get bank(): string {
    return this.props.bank;
  }

  get balance(): Money {
    return this.props.balance;
  }

  get color(): string {
    return this.props.color;
  }

  get icon(): string {
    return this.props.icon;
  }

  public credit(amount: Money): Account {
    return new Account({
      ...this.props,
      balance: this.props.balance.add(amount),
      updatedAt: new Date(),
    });
  }

  public debit(amount: Money): Account {
    return new Account({
      ...this.props,
      balance: this.props.balance.subtract(amount),
      updatedAt: new Date(),
    });
  }
}
