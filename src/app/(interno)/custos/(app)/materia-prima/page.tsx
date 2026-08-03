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
import { MaterialForm } from "./material-form";
import { DeleteMaterialButton } from "./delete-material-button";

const UNIT_LABEL: Record<string, string> = {
  UNIDADE: "unidade",
  METRO: "metro",
  METRO_QUADRADO: "m²",
  QUILOGRAMA: "kg",
  LITRO: "litro",
  PAR: "par",
  KIT: "kit",
};

export default async function MateriaPrimaPage() {
  const materials = await prisma.rawMaterial.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-medium text-foreground">Matéria-Prima</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cadastro único. Alterar o preço de compra aqui recalcula
          automaticamente o custo de todo produto que usa este material.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo material</CardTitle>
        </CardHeader>
        <CardContent>
          <MaterialForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Materiais cadastrados ({materials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {materials.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum material cadastrado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium text-foreground">
                      {material.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {material.category}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {UNIT_LABEL[material.unit] ?? material.unit}
                    </TableCell>
                    <TableCell>{formatBRL(material.unitPriceCents)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {material.supplier || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Intl.DateTimeFormat("pt-BR").format(
                        material.updatedAt
                      )}
                    </TableCell>
                    <TableCell>
                      <DeleteMaterialButton id={material.id} />
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
