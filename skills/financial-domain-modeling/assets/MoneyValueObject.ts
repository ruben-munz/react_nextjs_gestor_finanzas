export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'MXN' | 'JPY';

const CURRENCY_DECIMALS: Record<CurrencyCode, number> = {
  EUR: 2,
  USD: 2,
  GBP: 2,
  MXN: 2,
  JPY: 0,
};

export class Money {
  private readonly amountInMinorUnits: number;
  public readonly currency: CurrencyCode;

  private constructor(amountInMinorUnits: number, currency: CurrencyCode) {
    if (!Number.isSafeInteger(amountInMinorUnits)) {
      throw new Error(`El importe en unidades menores debe ser un entero seguro: ${amountInMinorUnits}`);
    }
    this.amountInMinorUnits = amountInMinorUnits;
    this.currency = currency;
    Object.freeze(this);
  }

  public static fromMinorUnits(amountInMinorUnits: number, currency: CurrencyCode = 'EUR'): Money {
    return new Money(amountInMinorUnits, currency);
  }

  public static fromDecimal(amount: number, currency: CurrencyCode = 'EUR'): Money {
    const factor = Math.pow(10, CURRENCY_DECIMALS[currency]);
    return new Money(Math.round(amount * factor), currency);
  }

  public get minorUnits(): number {
    return this.amountInMinorUnits;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountInMinorUnits + other.amountInMinorUnits, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountInMinorUnits - other.amountInMinorUnits, this.currency);
  }

  public allocate(ratios: number[]): Money[] {
    const totalRatio = ratios.reduce((acc, r) => acc + r, 0);
    if (totalRatio <= 0) throw new Error('Ratios inválidos');

    let remainder = this.amountInMinorUnits;
    const shares = ratios.map((ratio) => {
      const share = Math.floor((this.amountInMinorUnits * ratio) / totalRatio);
      remainder -= share;
      return share;
    });

    for (let i = 0; i < remainder; i++) {
      shares[i] += 1;
    }

    return shares.map((s) => new Money(s, this.currency));
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Divisas incompatibles: ${this.currency} vs ${other.currency}`);
    }
  }
}
