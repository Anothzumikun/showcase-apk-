import { Providers } from "@/components/providers";

export const metadata = { title: "Admin — Showcase" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
