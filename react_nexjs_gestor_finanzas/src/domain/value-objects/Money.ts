export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'MXN' | 'JPY';

const CURRENCY_DECIMALS: Record<CurrencyCode, number> = {
  EUR: 2,
  USD: 2,
  GBP: 2,
  MXN: 2,
  JPY: 0,
};

/**
 * Value Object Monetario inmutable (financial-domain-modeling).
 * Opera exclusivamente en unidades menores enteras (céntimos) para evitar
 * errores de coma flotante IEEE 754.
 */
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
    if (!Number.isFinite(amount)) {
      throw new Error(`El importe decimal debe ser un número finito: ${amount}`);
    }
    const factor = Math.pow(10, CURRENCY_DECIMALS[currency]);
    return new Money(Math.round(amount * factor), currency);
  }

  public static zero(currency: CurrencyCode = 'EUR'): Money {
    return new Money(0, currency);
  }

  public get minorUnits(): number {
    return this.amountInMinorUnits;
  }

  public toDecimal(): number {
    const factor = Math.pow(10, CURRENCY_DECIMALS[this.currency]);
    return this.amountInMinorUnits / factor;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountInMinorUnits + other.amountInMinorUnits, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountInMinorUnits - other.amountInMinorUnits, this.currency);
  }

  public isZero(): boolean {
    return this.amountInMinorUnits === 0;
  }

  public isPositive(): boolean {
    return this.amountInMinorUnits > 0;
  }

  public isNegative(): boolean {
    return this.amountInMinorUnits < 0;
  }

  public equals(other: Money): boolean {
    return this.currency === other.currency && this.amountInMinorUnits === other.amountInMinorUnits;
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

  public format(locale = 'es-ES'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: CURRENCY_DECIMALS[this.currency],
      maximumFractionDigits: CURRENCY_DECIMALS[this.currency],
    }).format(this.toDecimal());
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Divisas incompatibles: ${this.currency} vs ${other.currency}`);
    }
  }
}
