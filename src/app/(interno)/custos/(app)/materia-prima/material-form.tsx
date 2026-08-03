"use client";

import { useActionState, useRef } from "react";
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
import { saveMaterial, type MaterialFormState } from "./actions";

const UNIDADES: { value: string; label: string }[] = [
  { value: "UNIDADE", label: "Unidade" },
  { value: "METRO", label: "Metro" },
  { value: "METRO_QUADRADO", label: "Metro quadrado (m²)" },
  { value: "QUILOGRAMA", label: "Quilograma (kg)" },
  { value: "LITRO", label: "Litro" },
  { value: "PAR", label: "Par" },
  { value: "KIT", label: "Kit" },
];

export function MaterialForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<MaterialFormState, FormData>(
    async (prevState, formData) => {
      const result = await saveMaterial(prevState, formData);
      if (!result?.error) formRef.current?.reset();
      return result;
    },
    undefined
  );

  return (
    <form ref={formRef} action={action} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" placeholder="Ex: MDF 15mm" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">Categoria</Label>
        <Input id="category" name="category" placeholder="Ex: Madeira" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="unit">Unidade</Label>
        <Select name="unit" defaultValue="UNIDADE">
          <SelectTrigger id="unit" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNIDADES.map((u) => (
              <SelectItem key={u.value} value={u.value}>
                {u.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="unitPriceReais">Preço de compra (R$)</Label>
        <Input
          id="unitPriceReais"
          name="unitPriceReais"
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="supplier">Fornecedor</Label>
        <Input id="supplier" name="supplier" placeholder="Opcional" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Input id="notes" name="notes" placeholder="Opcional" />
      </div>

      <div className="flex items-end sm:col-span-2 lg:col-span-3">
        {state?.error && (
          <p className="mr-auto text-sm text-destructive">{state.error}</p>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar material"}
        </Button>
      </div>
    </form>
  );
}
