import Link from "next/link";
import { formatBRL } from "@/data/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardMetrics } from "@/server/costs/get-dashboard-metrics";

export default async function CustosDashboardPage() {
  const metrics = await getDashboardMetrics();

  if (metrics.products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <p className="text-foreground">Nenhum produto cadastrado ainda.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Cadastre a matéria-prima e os produtos para o dashboard começar a
          mostrar os números.{" "}
          <Link href="/custos/materia-prima" className="underline">
            Ir para Matéria-Prima
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Produto mais lucrativo</CardDescription>
            <CardTitle className="text-base">
              {metrics.maisLucrativo?.name ?? "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-foreground">
              {formatPercent(metrics.maisLucrativo?.cost.marginPercent ?? 0)}
            </span>
            <span className="ml-1 text-sm text-muted-foreground">margem</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Produto menos lucrativo</CardDescription>
            <CardTitle className="text-base">
              {metrics.menosLucrativo?.name ?? "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-foreground">
              {formatPercent(metrics.menosLucrativo?.cost.marginPercent ?? 0)}
            </span>
            <span className="ml-1 text-sm text-muted-foreground">margem</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Margem média</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-foreground">
              {formatPercent(metrics.margemMediaPercent)}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Custo médio</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-foreground">
              {formatBRL(metrics.custoMedioCents)}
            </span>
          </CardContent>
        </Card>
      </div>

      {metrics.margemBaixa.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produtos com margem baixa (abaixo de 20%)</CardTitle>
            <CardDescription>
              Candidatos a reajuste de preço ou revisão de custo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {metrics.margemBaixa.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2"
              >
                <div>
                  <p className="text-sm text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.code}</p>
                </div>
                <Badge variant="warning">
                  {formatPercent(p.cost.marginPercent)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatPercent(fraction: number) {
  return `${(fraction * 100).toFixed(1)}%`;
}
