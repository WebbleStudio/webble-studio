import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Webble Studio',
  description: 'Informativa completa sui cookie utilizzati da Webble Studio - Vady Solutions LLC',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CookiePolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
