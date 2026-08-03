import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/data/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductForm } from "./product-form";
import { DeleteProductButton } from "./delete-product-button";
import { allocateOverheadForProduct } from "@/server/costs/allocate-overhead";
import { calculateProductCost } from "@/server/costs/calculate-product-cost";
import type { ProductCostInput } from "@/server/costs/types";

const TYPE_LABEL: Record<string, string> = {
  PRODUCAO_PROPRIA: "Produção própria",
  REVENDA: "Revenda",
};

export default async function ProdutosPage() {
  const [products, rawMaterials, overheadCosts, settings] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { materials: { include: { material: true } } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.rawMaterial.findMany({ orderBy: { name: "asc" } }),
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

  const productsWithCost = products.map((product) => {
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

    return { product, cost: calculateProductCost(input) };
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-medium text-foreground">Produtos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cadastre a receita (matéria-prima + mão de obra) ou os dados de
          revenda de cada produto. O custo e a margem são recalculados na
          hora, sempre com os preços de matéria-prima mais atuais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo produto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            materials={rawMaterials.map((m) => ({
              id: m.id,
              name: m.name,
              unit: m.unit,
            }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos cadastrados ({productsWithCost.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {productsWithCost.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Custo total</TableHead>
                  <TableHead>Preço de venda</TableHead>
                  <TableHead>Margem</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsWithCost.map(({ product, cost }) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-foreground">
                      {product.code}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {product.name}
                      <span className="block text-xs text-muted-foreground">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {TYPE_LABEL[product.type] ?? product.type}
                    </TableCell>
                    <TableCell>{formatBRL(cost.totalCostCents)}</TableCell>
                    <TableCell>{formatBRL(cost.sellingPriceCents)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={cost.marginPercent < 0.2 ? "warning" : "success"}
                      >
                        {(cost.marginPercent * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DeleteProductButton id={product.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
