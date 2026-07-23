import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { CategoryTabs } from "@/components/category-tabs";
import { AppCard } from "@/components/app-card";
import { getApps, getCategories } from "@/lib/queries";
import { formatCount } from "@/lib/utils";
import { PackageSearch } from "lucide-react";

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { cat?: string; q?: string };
}) {
  const [categories, apps] = await Promise.all([
    getCategories(),
    getApps({ cat: searchParams.cat, q: searchParams.q }),
  ]);

  const totalDownloads = apps.reduce((sum, a) => sum + a.download_count, 0);

  return (
    <div>
      <Hero totalApps={apps.length} totalDownloads={formatCount(totalDownloads)} />

      <section className="container -mt-4 pb-16">
        <Suspense fallback={null}>
          <CategoryTabs categories={categories} />
        </Suspense>

        {searchParams.q && (
          <p className="mt-6 text-sm text-slate-400">
            Hasil pencarian untuk <span className="text-white">&ldquo;{searchParams.q}&rdquo;</span>
          </p>
        )}

        {apps.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <PackageSearch className="h-10 w-10 text-slate-600" />
            <p className="text-slate-400">Belum ada aplikasi pada kategori ini.</p>
          </div>
        ) : (
          <div id="unggulan" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
