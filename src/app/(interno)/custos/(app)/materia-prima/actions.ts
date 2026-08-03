"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { requireTeamMember } from "@/server/costs/require-team-member";

const UNIDADES = [
  "UNIDADE",
  "METRO",
  "METRO_QUADRADO",
  "QUILOGRAMA",
  "LITRO",
  "PAR",
  "KIT",
] as const;

const MaterialSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Nome muito curto."),
  category: z.string().trim().min(2, "Categoria obrigatória."),
  unit: z.enum(UNIDADES),
  unitPriceReais: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v) && v >= 0, "Preço inválido."),
  supplier: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type MaterialFormState = { error?: string } | undefined;

export async function saveMaterial(
  _prevState: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  await requireTeamMember();

  const parsed = MaterialSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    category: formData.get("category"),
    unit: formData.get("unit"),
    unitPriceReais: formData.get("unitPriceReais"),
    supplier: formData.get("supplier") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { id, unitPriceReais, ...rest } = parsed.data;
  const unitPriceCents = Math.round(unitPriceReais * 100);

  if (id) {
    await prisma.rawMaterial.update({
      where: { id },
      data: { ...rest, unitPriceCents },
    });
  } else {
    await prisma.rawMaterial.create({ data: { ...rest, unitPriceCents } });
  }

  revalidatePath("/custos/materia-prima");
  revalidatePath("/custos");
}

export async function deleteMaterial(id: string) {
  await requireTeamMember();
  await prisma.rawMaterial.delete({ where: { id } });
  revalidatePath("/custos/materia-prima");
  revalidatePath("/custos");
}
