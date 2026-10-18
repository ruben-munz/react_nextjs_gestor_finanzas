import { IInvestmentRepository } from '../../domain/repositories/IInvestmentRepository';
import { InvestmentDTO } from '../dtos/financial.dtos';

export class GetInvestmentsUseCase {
  constructor(private readonly investmentRepository: IInvestmentRepository) {}

  public async execute(): Promise<InvestmentDTO[]> {
    const investments = await this.investmentRepository.findAll();
    return investments.map((inv) => ({
      id: inv.id,
      name: inv.name,
      ticker: inv.ticker,
      type: inv.type,
      typeLabel: inv.typeLabel,
      quantity: inv.quantity,
      investedCents: inv.investedAmount.minorUnits,
      investedDecimal: inv.investedAmount.toDecimal(),
      investedFormatted: inv.investedAmount.format(),
      currentValueCents: inv.currentValue.minorUnits,
      currentValueDecimal: inv.currentValue.toDecimal(),
      currentValueFormatted: inv.currentValue.format(),
      netProfitCents: inv.netProfit.minorUnits,
      netProfitDecimal: inv.netProfit.toDecimal(),
      netProfitFormatted: inv.netProfit.format(),
      roiPercentage: inv.roiPercentage,
      updatedAtIso: inv.updatedAt.toISOString(),
    }));
  }
}
