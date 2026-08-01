import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background">
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-20 pt-28 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pb-28 md:pt-36">
          <div className="space-y-6">
            <Skeleton className="h-4 w-56" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-5/6" />
              <Skeleton className="h-12 w-2/3" />
            </div>
            <Skeleton className="h-16 w-full max-w-md" />
            <div className="flex gap-4">
              <Skeleton className="h-11 w-36" />
              <Skeleton className="h-11 w-36" />
            </div>
          </div>
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
