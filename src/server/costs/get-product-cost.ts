import "server-only";

import { prisma } from "@/lib/prisma";
import { allocateOverheadForProduct } from "./allocate-overhead";
import { calculateProductCost } from "./calculate-product-cost";
import type { ProductCostBreakdown, ProductCostInput } from "./types";

/**
 * Ponte entre o Postgres (via Prisma) e o motor de cálculo puro. Isola o
 * resto do app de saber como os dados são buscados — páginas e Server
 * Actions só chamam `getProductCost(productId)` e recebem o breakdown
 * pronto, sempre calculado com os preços de matéria-prima e parâmetros de
 * indireto mais atuais.
 */
export async function getProductCost(
  productId: string
): Promise<ProductCostBreakdown | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { materials: { include: { material: true } } },
  });

  if (!product) return null;

  const [overheadCosts, settings] = await Promise.all([
    prisma.overheadCost.findMany({ where: { active: true } }),
    getOrCreateCostSettings(),
  ]);

  const productLaborHours =
    product.type === "PRODUCAO_PROPRIA" && product.avgProductionMinutes
      ? product.avgProductionMinutes / 60
      : 0;

  const overheadCents = allocateOverheadForProduct(
    overheadCosts.map((o) => ({
      monthlyAmountCents: o.monthlyAmountCents,
      allocationMethod: o.allocationMethod,
    })),
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

  return calculateProductCost(input);
}

async function getOrCreateCostSettings() {
  return prisma.costSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
}
