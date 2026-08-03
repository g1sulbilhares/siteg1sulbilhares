"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "./actions";

export function DeleteProductButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        if (confirm("Remover este produto? Essa ação não pode ser desfeita."))
          await deleteProduct(id);
      }}
    >
      <Button type="submit" variant="ghost" size="icon-sm" aria-label="Remover">
        <Trash2 className="text-destructive" />
      </Button>
    </form>
  );
}
