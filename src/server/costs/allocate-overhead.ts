import type { CostSettingsInput, OverheadCostInput } from "./types";

/**
 * Rateio automático dos custos indiretos (energia, aluguel, manutenção...)
 * entre os produtos. Cada custo indireto tem seu próprio método de rateio:
 *
 * - PER_UNIT: dividido igualmente pela produção mensal estimada. Todo
 *   produto recebe a mesma fatia.
 * - PER_LABOR_HOUR: dividido pelas horas de mão de obra mensais estimadas,
 *   multiplicado pelas horas que ESTE produto consome. Produtos que
 *   demoram mais para fabricar absorvem mais indireto.
 *
 * Função pura, sem Prisma — recebe os custos indiretos ativos e os
 * parâmetros de CostSettings já buscados, devolve o valor em centavos que
 * cabe a um único produto.
 */
export function allocateOverheadForProduct(
  overheadCosts: OverheadCostInput[],
  settings: CostSettingsInput,
  productLaborHours: number
): number {
  const unitBasis = Math.max(settings.estimatedMonthlyUnits, 1);
  const laborHourBasis = Math.max(settings.estimatedMonthlyLaborHours, 1);

  return overheadCosts.reduce((total, cost) => {
    if (cost.allocationMethod === "PER_UNIT") {
      return total + cost.monthlyAmountCents / unitBasis;
    }

    // PER_LABOR_HOUR
    const costPerHour = cost.monthlyAmountCents / laborHourBasis;
    return total + costPerHour * productLaborHours;
  }, 0);
}
