import type { Metadata } from "next";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: {
    default: "Serhan Turizm",
    template: "%s · Serhan Turizm",
  },
  description: "Serhan Turizm kurumsal web sitesi.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
