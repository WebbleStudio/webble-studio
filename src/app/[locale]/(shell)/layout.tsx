import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";
import { getDictionary } from "@/lib/getDictionary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingChatWidget from "@/components/ui/FloatingChatWidget";
import BookingModal from "@/components/ui/BookingModal";

interface ShellLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function ShellLayout({ children, params }: ShellLayoutProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main>{children}</main>
      <Footer locale={locale} dict={dict} />
      <FloatingChatWidget />
      <BookingModal dict={dict} />
    </>
  );
}
