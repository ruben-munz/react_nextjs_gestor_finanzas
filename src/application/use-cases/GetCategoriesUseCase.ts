import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { CategoryDTO } from '../dtos/financial.dtos';

export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      type: cat.type,
      icon: cat.icon,
      monthlyBudgetCents: cat.monthlyBudget ? cat.monthlyBudget.minorUnits : null,
      monthlyBudgetFormatted: cat.monthlyBudget ? cat.monthlyBudget.format() : null,
    }));
  }
}
