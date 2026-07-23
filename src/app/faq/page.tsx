import { getGlobalFaqs } from "@/lib/queries";
import { FaqAccordion } from "@/components/faq-accordion";

export const metadata = { title: "FAQ" };

export default async function FaqPage() {
  const faqs = await getGlobalFaqs();

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="font-display text-2xl font-bold text-white">Pertanyaan Umum</h1>
      <p className="mt-2 text-sm text-slate-400">
        Jawaban seputar cara pakai, instalasi, dan dukungan untuk semua rilis di Showcase.
      </p>
      <div className="mt-8">
        {faqs.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada FAQ yang ditambahkan.</p>
        ) : (
          <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        )}
      </div>
    </div>
  );
}
