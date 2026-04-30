/**
 * /progetti redirecta permanentemente a /portfolio (vedere next.config.ts e page.tsx).
 * Questo layout non viene mai renderizzato — nessun HTML viene servito da questa route.
 */

export default function ProgettiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
