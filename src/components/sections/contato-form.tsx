"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const PRODUTOS = [
  "Mesa Residencial 150",
  "Mesa Familiar 180",
  "Mesa Premium 230",
  "Tampo para Ping-Pong",
  "Outro",
] as const;

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  produto: z.enum(PRODUTOS, { message: "Selecione um produto" }),
  cidade: z.string().min(2, "Informe sua cidade"),
  mensagem: z.string().min(5, "Conte um pouco mais para a gente te ajudar"),
});

type FormValues = z.infer<typeof schema>;

export function ContatoForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      cidade: "",
      mensagem: "",
      produto: undefined,
    },
  });

  function onSubmit(data: FormValues) {
    const text = [
      `Olá, meu nome é ${data.nome}.`,
      `Tenho interesse em: ${data.produto}.`,
      `Cidade: ${data.cidade}.`,
      data.mensagem,
    ].join("\n");

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      text
    )}`;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-line bg-surface p-6 md:p-8"
    >
      <div>
        <Label htmlFor="nome">Seu nome</Label>
        <Input id="nome" className="mt-2" {...register("nome")} />
        {errors.nome && (
          <p className="mt-1 text-xs text-destructive">
            {errors.nome.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="produto">Produto de interesse</Label>
        <Select
          onValueChange={(v) =>
            setValue("produto", v as FormValues["produto"], {
              shouldValidate: true,
            })
          }
          value={watch("produto") ?? ""}
        >
          <SelectTrigger id="produto" className="mt-2 w-full">
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent>
            {PRODUTOS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.produto && (
          <p className="mt-1 text-xs text-destructive">
            {errors.produto.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="cidade">Cidade</Label>
        <Input id="cidade" className="mt-2" {...register("cidade")} />
        {errors.cidade && (
          <p className="mt-1 text-xs text-destructive">
            {errors.cidade.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="mensagem">Mensagem</Label>
        <Textarea
          id="mensagem"
          className="mt-2"
          rows={4}
          placeholder="Medidas do espaço, cor de preferência, prazo desejado..."
          {...register("mensagem")}
        />
        {errors.mensagem && (
          <p className="mt-1 text-xs text-destructive">
            {errors.mensagem.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        Enviar pelo WhatsApp
      </Button>
    </form>
  );
}
