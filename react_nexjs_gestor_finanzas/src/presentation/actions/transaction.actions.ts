'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Money } from '../../domain/value-objects/Money';
import { makeFinancialContainer } from '../../infrastructure/container';

const CreateTransactionSchema = z.object({
  accountId: z.string().trim().min(1, 'Selecciona una cuenta'),
  categoryId: z.string().trim().min(1, 'Selecciona una categoría'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'El tipo debe ser Ingreso o Gasto',
  }),
  amountDecimal: z.coerce
    .number({ message: 'Introduce un importe numérico válido' })
    .positive('El importe debe ser mayor que 0,00 €'),
  concept: z
    .string()
    .trim()
    .min(2, 'El concepto debe tener al menos 2 caracteres')
    .max(255, 'El concepto no puede superar 255 caracteres'),
  date: z.string().optional(),
});

export interface CreateTransactionActionState {
  success?: boolean;
  error?: string;
  timestamp?: number;
}

export async function createTransactionAction(
  _prevState: CreateTransactionActionState,
  formData: FormData
): Promise<CreateTransactionActionState> {
  const rawData = {
    accountId: formData.get('accountId'),
    categoryId: formData.get('categoryId'),
    type: formData.get('type'),
    amountDecimal: formData.get('amountDecimal'),
    concept: formData.get('concept'),
    date: formData.get('date') || undefined,
  };

  const parsed = CreateTransactionSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message || 'Datos del movimiento inválidos.',
    };
  }

  try {
    const moneyAmount = Money.fromDecimal(parsed.data.amountDecimal, 'EUR');
    const txDate = parsed.data.date ? new Date(parsed.data.date) : new Date();

    const { createTransactionUseCase } = makeFinancialContainer();
    await createTransactionUseCase.execute({
      accountId: parsed.data.accountId,
      categoryId: parsed.data.categoryId,
      type: parsed.data.type,
      amountCents: moneyAmount.minorUnits,
      concept: parsed.data.concept,
      date: Number.isNaN(txDate.getTime()) ? new Date() : txDate,
    });

    revalidatePath('/');
    revalidatePath('/movimientos');
    return {
      success: true,
      timestamp: Date.now(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al registrar el movimiento en la base de datos.';
    return {
      success: false,
      error: message,
    };
  }
}
