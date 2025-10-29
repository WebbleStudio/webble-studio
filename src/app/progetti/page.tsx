/**
 * Progetti Page - Server-Side Redirect to Portfolio
 * Pagina SEO-ottimizzata che redirige immediatamente a /portfolio
 * Il redirect avviene lato server, senza flash di contenuto
 */

import { redirect } from 'next/navigation';

export default function ProgettiPage() {
  // Redirect immediato lato server - nessun flash di contenuto
  redirect('/portfolio');
}

