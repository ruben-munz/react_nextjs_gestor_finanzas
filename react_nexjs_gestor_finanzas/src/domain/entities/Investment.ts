import { Money } from '../value-objects/Money';

export type InvestmentAssetType = 'STOCK' | 'ETF' | 'CRYPTO' | 'REAL_ESTATE' | 'BOND';

export interface InvestmentProps {
  id: string;
  name: string;
  ticker: string;
  type: InvestmentAssetType;
  quantity: number;
  investedAmount: Money;
  currentValue: Money;
  updatedAt: Date;
}

export class Investment {
  private readonly props: InvestmentProps;

  public constructor(props: InvestmentProps) {
    if (!props.id.trim()) {
      throw new Error('El identificador de la inversión es obligatorio.');
    }
    if (!props.name.trim()) {
      throw new Error('El nombre del activo es obligatorio.');
    }
    if (!props.ticker.trim()) {
      throw new Error('El ticker del activo es obligatorio.');
    }
    if (props.quantity <= 0) {
      throw new Error('La cantidad o participaciones debe ser mayor que 0.');
    }
    if (props.investedAmount.minorUnits <= 0) {
      throw new Error('El coste invertido debe ser estrictamente mayor que 0.');
    }
    this.props = Object.freeze({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get ticker(): string {
    return this.props.ticker;
  }

  get type(): InvestmentAssetType {
    return this.props.type;
  }

  get typeLabel(): string {
    const labels: Record<InvestmentAssetType, string> = {
      ETF: 'ETF Indexado',
      STOCK: 'Acción',
      CRYPTO: 'Criptomoneda',
      BOND: 'Renta Fija / Bono',
      REAL_ESTATE: 'Inmobiliario',
    };
    return labels[this.props.type];
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get investedAmount(): Money {
    return this.props.investedAmount;
  }

  get currentValue(): Money {
    return this.props.currentValue;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Beneficio o pérdida latente neta en unidades monetarias (Money).
   */
  get netProfit(): Money {
    return this.props.currentValue.subtract(this.props.investedAmount);
  }

  /**
   * Porcentaje de rentabilidad (ROI) redondeado a 2 decimales.
   */
  get roiPercentage(): number {
    const invested = this.props.investedAmount.minorUnits;
    if (invested === 0) return 0;
    const profit = this.netProfit.minorUnits;
    return Number(((profit / invested) * 100).toFixed(2));
  }
}
