"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveProduct, type ProductFormState } from "./actions";

type RawMaterialOption = {
  id: string;
  name: string;
  unit: string;
};

const UNIT_LABEL: Record<string, string> = {
  UNIDADE: "unidade",
  METRO: "metro",
  METRO_QUADRADO: "m²",
  QUILOGRAMA: "kg",
  LITRO: "litro",
  PAR: "par",
  KIT: "kit",
};

type BomRow = { materialId: string; quantity: string };

export function ProductForm({ materials }: { materials: RawMaterialOption[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<"PRODUCAO_PROPRIA" | "REVENDA">(
    "PRODUCAO_PROPRIA"
  );
  const [bom, setBom] = useState<BomRow[]>([{ materialId: "", quantity: "" }]);

  const [state, action, pending] = useActionState<ProductFormState, FormData>(
    async (prevState, formData) => {
      const validBom = bom.filter((row) => row.materialId && row.quantity);
      formData.set("materialsJson", JSON.stringify(validBom));
      const result = await saveProduct(prevState, formData);
      if (!result?.error) {
        formRef.current?.reset();
        setBom([{ materialId: "", quantity: "" }]);
      }
      return result;
    },
    undefined
  );

  const materialsById = useMemo(
    () => new Map(materials.map((m) => [m.id, m])),
    [materials]
  );

  function updateBomRow(index: number, patch: Partial<BomRow>) {
    setBom((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  }

  function addBomRow() {
    setBom((rows) => [...rows, { materialId: "", quantity: "" }]);
  }

  function removeBomRow(index: number) {
    setBom((rows) => rows.filter((_, i) => i !== index));
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="code">Código</Label>
          <Input id="code" name="code" placeholder="Ex: MS-001" required />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ex: Mesa de sinuca 2,20m"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Categoria</Label>
          <Input id="category" name="category" placeholder="Ex: Mesas" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Tipo</Label>
          <Select
            name="type"
            value={type}
            onValueChange={(v) => setType(v as "PRODUCAO_PROPRIA" | "REVENDA")}
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRODUCAO_PROPRIA">Produção própria</SelectItem>
              <SelectItem value="REVENDA">Revenda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sellingPriceReais">Preço de venda (R$)</Label>
          <Input
            id="sellingPriceReais"
            name="sellingPriceReais"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            required
          />
        </div>
      </div>

      {type === "PRODUCAO_PROPRIA" ? (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="avgProductionMinutes">
                Tempo médio de produção (min)
              </Label>
              <Input
                id="avgProductionMinutes"
                name="avgProductionMinutes"
                type="number"
                step="1"
                min="1"
                placeholder="Ex: 480"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="laborCostPerHourReais">Custo de mão de obra (R$/h)</Label>
              <Input
                id="laborCostPerHourReais"
                name="laborCostPerHourReais"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="workersCount">Nº de trabalhadores</Label>
              <Input
                id="workersCount"
                name="workersCount"
                type="number"
                step="1"
                min="1"
                placeholder="Ex: 2"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Matéria-prima usada</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBomRow}
              >
                <Plus /> Adicionar material
              </Button>
            </div>

            {materials.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma matéria-prima cadastrada ainda. Cadastre em
                Matéria-Prima antes de montar a receita do produto.
              </p>
            )}

            {bom.map((row, index) => {
              const selected = materialsById.get(row.materialId);
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 items-end gap-2 sm:grid-cols-[1fr_auto_auto]"
                >
                  <div className="flex flex-col gap-1.5">
                    <Select
                      value={row.materialId}
                      onValueChange={(v) => updateBomRow(index, { materialId: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      placeholder="Qtd."
                      className="w-28"
                      value={row.quantity}
                      onChange={(e) =>
                        updateBomRow(index, { quantity: e.target.value })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {selected ? UNIT_LABEL[selected.unit] ?? selected.unit : ""}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remover material"
                    onClick={() => removeBomRow(index)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="purchasePriceReais">Preço de compra (R$)</Label>
            <Input
              id="purchasePriceReais"
              name="purchasePriceReais"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="freightReais">Frete (R$)</Label>
            <Input
              id="freightReais"
              name="freightReais"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              required
            />
          </div>
        </div>
      )}

      <div className="flex items-center">
        {state?.error && (
          <p className="mr-auto text-sm text-destructive">{state.error}</p>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar produto"}
        </Button>
      </div>
    </form>
  );
}
