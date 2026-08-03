import type { ProductCostBreakdown, ProductCostInput } from "./types";

/**
 * O motor de cálculo de custos. Função pura — sem Prisma, sem Next.js, sem
 * I/O. Recebe os números já resolvidos (preço de cada material, parâmetros
 * de mão de obra, indireto já rateado) e devolve o breakdown completo.
 *
 * Isso é o que garante "trocar o preço do MDF recalcula tudo sozinho": quem
 * chama esta função sempre lê o preço do material em `RawMaterial` na hora,
 * nunca um valor copiado/cacheado no produto.
 */
export function calculateProductCost(
  input: ProductCostInput
): ProductCostBreakdown {
  const materialCostCents =
    input.type === "PRODUCAO_PROPRIA"
      ? calculateMaterialCost(input.materials)
      : input.purchasePriceCents + input.freightCents;

  const laborCostCents =
    input.type === "PRODUCAO_PROPRIA" ? calculateLaborCost(input.labor) : 0;

  const overheadCostCents = Math.round(input.overheadCents);

  const totalCostCents = materialCostCents + laborCostCents + overheadCostCents;
  const profitCents = input.sellingPriceCents - totalCostCents;

  return {
    materialCostCents,
    laborCostCents,
    overheadCostCents,
    totalCostCents,
    sellingPriceCents: input.sellingPriceCents,
    profitCents,
    marginPercent:
      input.sellingPriceCents > 0 ? profitCents / input.sellingPriceCents : 0,
    markupPercent: totalCostCents > 0 ? profitCents / totalCostCents : 0,
  };
}

function calculateMaterialCost(
  materials: { quantity: number; materialUnitPriceCents: number }[]
): number {
  return Math.round(
    materials.reduce(
      (sum, item) => sum + item.quantity * item.materialUnitPriceCents,
      0
    )
  );
}

function calculateLaborCost(
  labor: {
    avgProductionMinutes: number;
    laborCostPerHourCents: number;
    workersCount: number;
  } | null
): number {
  if (!labor) return 0;
  const hours = labor.avgProductionMinutes / 60;
  return Math.round(hours * labor.laborCostPerHourCents * labor.workersCount);
}
