import { CreateTransactionUseCase } from '../application/use-cases/CreateTransactionUseCase';
import { GetAccountsUseCase } from '../application/use-cases/GetAccountsUseCase';
import { GetCategoriesUseCase } from '../application/use-cases/GetCategoriesUseCase';
import { GetFinancialDashboardUseCase } from '../application/use-cases/GetFinancialDashboardUseCase';
import { GetInvestmentsUseCase } from '../application/use-cases/GetInvestmentsUseCase';
import { GetTransactionsUseCase } from '../application/use-cases/GetTransactionsUseCase';
import { MySqlAccountRepository } from './repositories/MySqlAccountRepository';
import { MySqlCategoryRepository } from './repositories/MySqlCategoryRepository';
import { MySqlInvestmentRepository } from './repositories/MySqlInvestmentRepository';
import { MySqlTransactionRepository } from './repositories/MySqlTransactionRepository';

/**
 * Contenedor de Inyección de Dependencias (Clean Architecture).
 * Ensambla las implementaciones MySQL de infraestructura con los Casos de Uso
 * de la capa de Aplicación.
 */
export function makeFinancialContainer() {
  const accountRepository = new MySqlAccountRepository();
  const categoryRepository = new MySqlCategoryRepository();
  const transactionRepository = new MySqlTransactionRepository();
  const investmentRepository = new MySqlInvestmentRepository();

  return {
    getFinancialDashboardUseCase: new GetFinancialDashboardUseCase(
      accountRepository,
      transactionRepository,
      investmentRepository
    ),
    getAccountsUseCase: new GetAccountsUseCase(accountRepository),
    getCategoriesUseCase: new GetCategoriesUseCase(categoryRepository),
    getTransactionsUseCase: new GetTransactionsUseCase(transactionRepository),
    createTransactionUseCase: new CreateTransactionUseCase(
      transactionRepository,
      accountRepository,
      categoryRepository
    ),
    getInvestmentsUseCase: new GetInvestmentsUseCase(investmentRepository),
  };
}
