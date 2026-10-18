import { Investment } from '../entities/Investment';

export interface IInvestmentRepository {
  findAll(): Promise<Investment[]>;
  findById(id: string): Promise<Investment | null>;
}
