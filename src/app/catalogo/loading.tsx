import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-12 w-96 max-w-full" />
          <Skeleton className="mt-4 h-4 w-80 max-w-full" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 rounded-lg border border-line bg-surface p-6 md:grid-cols-2 md:p-10">
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2 pt-4">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </div>
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
              <Skeleton className="mt-6 h-10 w-40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
