import "server-only";

import { prisma } from "@/lib/prisma";
import { allocateOverheadForProduct } from "./allocate-overhead";
import { calculateProductCost } from "./calculate-product-cost";
import type { ProductCostBreakdown, ProductCostInput } from "./types";

export type ProductWithCost = {
  id: string;
  code: string;
  name: string;
  category: string;
  cost: ProductCostBreakdown;
};

export type DashboardMetrics = {
  products: ProductWithCost[];
  maisLucrativo: ProductWithCost | null;
  menosLucrativo: ProductWithCost | null;
  margemMediaPercent: number;
  custoMedioCents: number;
  /** Margem abaixo de 20% — limiar simples para o MVP, ajustável depois. */
  margemBaixa: ProductWithCost[];
};

const MARGEM_BAIXA_LIMITE = 0.2;

/**
 * Calcula o custo de todos os produtos ativos de uma vez (uma única
 * consulta ao banco, sem N+1) e deriva as métricas do dashboard. Reusa o
 * mesmo motor puro de `calculate-product-cost.ts` — nenhuma lógica de custo
 * duplicada entre esta função e `get-product-cost.ts`.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [rawProducts, overheadCosts, settings] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { materials: { include: { material: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.overheadCost.findMany({ where: { active: true } }),
    prisma.costSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    }),
  ]);

  const overheadInputs = overheadCosts.map((o) => ({
    monthlyAmountCents: o.monthlyAmountCents,
    allocationMethod: o.allocationMethod,
  }));

  const products: ProductWithCost[] = rawProducts.map((product) => {
    const productLaborHours =
      product.type === "PRODUCAO_PROPRIA" && product.avgProductionMinutes
        ? product.avgProductionMinutes / 60
        : 0;

    const overheadCents = allocateOverheadForProduct(
      overheadInputs,
      settings,
      productLaborHours
    );

    const input: ProductCostInput =
      product.type === "PRODUCAO_PROPRIA"
        ? {
            type: "PRODUCAO_PROPRIA",
            sellingPriceCents: product.sellingPriceCents,
            overheadCents,
            materials: product.materials.map((pm) => ({
              quantity: Number(pm.quantity),
              materialUnitPriceCents: pm.material.unitPriceCents,
            })),
            labor:
              product.avgProductionMinutes &&
              product.laborCostPerHourCents &&
              product.workersCount
                ? {
                    avgProductionMinutes: product.avgProductionMinutes,
                    laborCostPerHourCents: product.laborCostPerHourCents,
                    workersCount: product.workersCount,
                  }
                : null,
          }
        : {
            type: "REVENDA",
            sellingPriceCents: product.sellingPriceCents,
            overheadCents,
            purchasePriceCents: product.purchasePriceCents ?? 0,
            freightCents: product.freightCents ?? 0,
          };

    return {
      id: product.id,
      code: product.code,
      name: product.name,
      category: product.category,
      cost: calculateProductCost(input),
    };
  });

  if (products.length === 0) {
    return {
      products: [],
      maisLucrativo: null,
      menosLucrativo: null,
      margemMediaPercent: 0,
      custoMedioCents: 0,
      margemBaixa: [],
    };
  }

  const byMargin = [...products].sort(
    (a, b) => b.cost.marginPercent - a.cost.marginPercent
  );

  const margemMediaPercent =
    products.reduce((sum, p) => sum + p.cost.marginPercent, 0) / products.length;
  const custoMedioCents =
    products.reduce((sum, p) => sum + p.cost.totalCostCents, 0) / products.length;

  return {
    products,
    maisLucrativo: byMargin[0] ?? null,
    menosLucrativo: byMargin[byMargin.length - 1] ?? null,
    margemMediaPercent,
    custoMedioCents,
    margemBaixa: products.filter(
      (p) => p.cost.marginPercent < MARGEM_BAIXA_LIMITE
    ),
  };
}
