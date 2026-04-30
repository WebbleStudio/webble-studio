/**
 * Progetti Page - Redirect permanente a /portfolio
 * Il redirect principale avviene in next.config.ts (308 a livello CDN).
 * Questo componente serve da fallback nel caso il redirect config non venga applicato.
 */

import { permanentRedirect } from 'next/navigation';

export default function ProgettiPage() {
  permanentRedirect('/portfolio');
}

