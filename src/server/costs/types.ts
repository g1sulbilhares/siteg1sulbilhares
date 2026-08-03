// Tipos do motor de cálculo. Deliberadamente não importam nada de
// `@prisma/client`: as funções em `calculate-product-cost.ts` e
// `allocate-overhead.ts` recebem dados já buscados (por uma Server Action,
// uma rota, um futuro bot de WhatsApp — o que for) e devolvem números. Isso
// é o que permite reusar o mesmo motor fora do Next.js no futuro.

export type ProductMaterialInput = {
  quantity: number;
  materialUnitPriceCents: number;
};

export type LaborInput = {
  avgProductionMinutes: number;
  laborCostPerHourCents: number;
  workersCount: number;
};

export type OverheadCostInput = {
  monthlyAmountCents: number;
  allocationMethod: "PER_UNIT" | "PER_LABOR_HOUR";
};

export type CostSettingsInput = {
  estimatedMonthlyUnits: number;
  estimatedMonthlyLaborHours: number;
};

export type ProducaoPropriaCostInput = {
  type: "PRODUCAO_PROPRIA";
  sellingPriceCents: number;
  materials: ProductMaterialInput[];
  labor: LaborInput | null;
  overheadCents: number;
};

export type RevendaCostInput = {
  type: "REVENDA";
  sellingPriceCents: number;
  purchasePriceCents: number;
  freightCents: number;
  overheadCents: number;
};

export type ProductCostInput = ProducaoPropriaCostInput | RevendaCostInput;

export type ProductCostBreakdown = {
  materialCostCents: number;
  laborCostCents: number;
  overheadCostCents: number;
  totalCostCents: number;
  sellingPriceCents: number;
  profitCents: number;
  /** Fração (0.30 = 30%), não porcentagem já multiplicada por 100. */
  marginPercent: number;
  /** Fração (0.30 = 30%), não porcentagem já multiplicada por 100. */
  markupPercent: number;
}