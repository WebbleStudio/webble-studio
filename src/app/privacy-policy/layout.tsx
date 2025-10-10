import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Webble Studio',
  description: 'Informativa completa sul trattamento dei dati personali - Vady Solutions LLC',
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

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

