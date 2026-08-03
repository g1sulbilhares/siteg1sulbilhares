"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { requireTeamMember } from "@/server/costs/require-team-member";

const BomItemSchema = z.object({
  materialId: z.string().min(1),
  quantity: z.coerce.number().positive("Quantidade deve ser maior que zero."),
});

// Os dois formatos (produção própria vs. revenda) compartilham código, nome,
// categoria e preço de venda — o resto é condicional ao `type`, validado
// nos branches abaixo em vez de campos `.optional()` soltos, pra não deixar
// salvar um produto de produção própria sem mão de obra por engano.
const BaseSchema = z.object({
  id: z.string().optional(),
  code: z.string().trim().min(1, "Código obrigatório."),
  name: z.string().trim().min(2, "Nome muito curto."),
  category: z.string().trim().min(2, "Categoria obrigatória."),
  sellingPriceReais: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v) && v >= 0, "Preço de venda inválido."),
});

const ProducaoPropriaSchema = BaseSchema.extend({
  type: z.literal("PRODUCAO_PROPRIA"),
  avgProductionMinutes: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v) && v > 0, "Tempo de produção inválido."),
  laborCostPerHourReais: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v) && v >= 0, "Custo de mão de obra inválido."),
  workersCount: z.coerce
    .number()
    .int()
    .refine((v) => !Number.isNaN(v) && v > 0, "Nº de trabalhadores inválido."),
  materials: z
    .array(BomItemSchema)
    .min(1, "Adicione ao menos uma matéria-prima."),
});

const RevendaSchema = BaseSchema.extend({
  type: z.literal("REVENDA"),
  purchasePriceReais: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v) && v >= 0, "Preço de compra inválido."),
  freightReais: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v) && v >= 0, "Frete inválido."),
});

const ProductSchema = z.discriminatedUnion("type", [
  ProducaoPropriaSchema,
  RevendaSchema,
]);

export type ProductFormState = { error?: string } | undefined;

function toCents(reais: number) {
  return Math.round(reais * 100);
}

export async function saveProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireTeamMember();

  const type = formData.get("type");
  const materialsJson = formData.get("materialsJson");
  let materials: unknown = [];
  if (typeof materialsJson === "string" && materialsJson.length > 0) {
    try {
      materials = JSON.parse(materialsJson);
    } catch {
      return { error: "Lista de materiais inválida." };
    }
  }

  const parsed = ProductSchema.safeParse({
    id: formData.get("id") || undefined,
    code: formData.get("code"),
    name: formData.get("name"),
    category: formData.get("category"),
    sellingPriceReais: formData.get("sellingPriceReais"),
    type,
    avgProductionMinutes: formData.get("avgProductionMinutes") || undefined,
    laborCostPerHourReais: formData.get("laborCostPerHourReais") || undefined,
    workersCount: formData.get("workersCount") || undefined,
    materials,
    purchasePriceReais: formData.get("purchasePriceReais") || undefined,
    freightReais: formData.get("freightReais") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const data = parsed.data;
  const { id } = data;

  const baseData = {
    code: data.code,
    name: data.name,
    category: data.category,
    sellingPriceCents: toCents(data.sellingPriceReais),
  };

  try {
    if (data.type === "PRODUCAO_PROPRIA") {
      const productData = {
        ...baseData,
        type: "PRODUCAO_PROPRIA" as const,
        avgProductionMinutes: Math.round(data.avgProductionMinutes),
        laborCostPerHourCents: toCents(data.laborCostPerHourReais),
        workersCount: data.workersCount,
        purchasePriceCents: null,
        freightCents: null,
      };

      if (id) {
        await prisma.$transaction([
          prisma.product.update({ where: { id }, data: productData }),
          prisma.productMaterial.deleteMany({ where: { productId: id } }),
          prisma.productMaterial.createMany({
            data: data.materials.map((m) => ({
              productId: id,
              materialId: m.materialId,
              quantity: m.quantity,
            })),
          }),
        ]);
      } else {
        await prisma.product.create({
          data: {
            ...productData,
            materials: {
              create: data.materials.map((m) => ({
                materialId: m.materialId,
                quantity: m.quantity,
              })),
            },
          },
        });
      }
    } else {
      const productData = {
        ...baseData,
        type: "REVENDA" as const,
        purchasePriceCents: toCents(data.purchasePriceReais),
        freightCents: toCents(data.freightReais),
        avgProductionMinutes: null,
        laborCostPerHourCents: null,
        workersCount: null,
      };

      if (id) {
        await prisma.$transaction([
          prisma.product.update({ where: { id }, data: productData }),
          prisma.productMaterial.deleteMany({ where: { productId: id } }),
        ]);
      } else {
        await prisma.product.create({ data: productData });
      }
    }
  } catch (err) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as { code?: string }).code === "P2002"
    ) {
      return { error: "Já existe um produto com esse código." };
    }
    throw err;
  }

  revalidatePath("/custos/produtos");
  revalidatePath("/custos");
}

export async function deleteProduct(id: string) {
  await requireTeamMember();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/custos/produtos");
  revalidatePath("/custos");
}
