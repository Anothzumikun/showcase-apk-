import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, HardDrive, Tag, User, Smartphone } from "lucide-react";
import { getAppBySlug, getAppFaqs } from "@/lib/queries";
import { DeviceMockup } from "@/components/device-mockup";
import { DownloadButton } from "@/components/download-button";
import { FaqAccordion } from "@/components/faq-accordion";
import { Badge } from "@/components/ui/badge";
import { formatCount } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const app = await getAppBySlug(params.slug);
  if (!app) return { title: "Tidak ditemukan" };
  return {
    title: `${app.name}${app.tagline ? ` — ${app.tagline}` : ""}`,
    description: app.description ?? undefined,
    openGraph: {
      title: app.name,
      description: app.description ?? undefined,
      images: app.icon_url ? [app.icon_url] : undefined,
    },
  };
}

export default async function AppDetailPage({ params }: { params: { slug: string } }) {
  const app = await getAppBySlug(params.slug);
  if (!app) notFound();

  const faqs = await getAppFaqs(app.id);

  return (
    <div className="container max-w-3xl py-8">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-surface-border bg-surface-raised">
          {app.icon_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.icon_url} alt={app.name} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{app.name}</h1>
          {app.tagline && <Badge variant="soft" className="mt-1">{app.tagline}</Badge>}
          <p className="mt-1 text-sm text-slate-500">
            {formatCount(app.download_count)} unduhan · v{app.version}
          </p>
        </div>
      </div>

      {app.description && (
        <p className="mt-6 text-sm leading-relaxed text-slate-400">{app.description}</p>
      )}

      {/* Info grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InfoCell icon={<Tag className="h-4 w-4" />} label="Versi" value={app.version ?? "-"} />
        <InfoCell icon={<HardDrive className="h-4 w-4" />} label="Ukuran" value={app.size ?? "-"} />
        <InfoCell icon={<User className="h-4 w-4" />} label="Developer" value={app.developer ?? "-"} />
        <InfoCell icon={<Smartphone className="h-4 w-4" />} label="Kategori" value={app.category?.name ?? "-"} />
      </div>

      {/* Mod info */}
      {app.mod_info.length > 0 && (
        <div className="mt-8 rounded-xl2 border border-surface-border bg-surface/60 p-5">
          <h2 className="font-display text-sm font-semibold text-white">Fitur Rilis Ini</h2>
          <ul className="mt-3 space-y-2">
            {app.mod_info.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Download button */}
      <div className="mt-8 flex justify-center">
        <DownloadButton
          appId={app.id}
          appName={app.name}
          downloadUrl={app.download_url}
          initialCount={app.download_count}
        />
      </div>

      {/* Device mockup screenshots */}
      {app.screenshots.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-center font-display text-sm font-semibold text-white">
            Tampilan Aplikasi
          </h2>
          <DeviceMockup screenshots={app.screenshots} appName={app.name} />
        </div>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-2 font-display text-sm font-semibold text-white">
            Pertanyaan Umum
          </h2>
          <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </div>
      )}

      {app.requirements && (
        <p className="mt-8 text-center text-xs text-slate-600">Membutuhkan {app.requirements}</p>
      )}
    </div>
  );
}

function InfoCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface/50 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-brand">{icon}</div>
      <div className="truncate text-sm font-semibold text-white">{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
}
