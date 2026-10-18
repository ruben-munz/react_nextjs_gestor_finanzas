import { InvalidBudgetLimitError } from '../errors/DomainError';
import { Money } from '../value-objects/Money';

export type CategoryType = 'INCOME' | 'EXPENSE';

export interface CategoryProps {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  monthlyBudget: Money | null;
}

export class Category {
  private readonly props: CategoryProps;

  public constructor(props: CategoryProps) {
    if (!props.id.trim()) {
      throw new Error('El identificador de la categoría es obligatorio.');
    }
    if (!props.name.trim()) {
      throw new Error('El nombre de la categoría es obligatorio.');
    }
    if (props.monthlyBudget !== null && props.monthlyBudget.minorUnits <= 0) {
      throw new InvalidBudgetLimitError();
    }
    this.props = Object.freeze({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): CategoryType {
    return this.props.type;
  }

  get icon(): string {
    return this.props.icon;
  }

  get monthlyBudget(): Money | null {
    return this.props.monthlyBudget;
  }
}
