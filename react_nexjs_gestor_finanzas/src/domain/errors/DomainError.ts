export class DomainError extends Error {
  public readonly code: string;

  constructor(message: string, code = 'DOMAIN_ERROR') {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}

export class InvalidTransactionAmountError extends DomainError {
  constructor(message = 'Ninguna transacción puede tener un importe menor o igual a 0 céntimos.') {
    super(message, 'INVALID_TRANSACTION_AMOUNT');
    this.name = 'InvalidTransactionAmountError';
  }
}

export class InvalidBudgetLimitError extends DomainError {
  constructor(message = 'Todo presupuesto mensual debe tener un límite estrictamente mayor que 0.') {
    super(message, 'INVALID_BUDGET_LIMIT');
    this.name = 'InvalidBudgetLimitError';
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: string) {
    super(`${entityName} con ID "${id}" no fue encontrado.`, 'ENTITY_NOT_FOUND');
    this.name = 'EntityNotFoundError';
  }
}
