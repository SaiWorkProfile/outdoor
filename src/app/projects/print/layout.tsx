import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * The print view is a browser-utility page (Project Mode saved in localStorage).
 * It must not inherit the homepage title/description and must not be indexed.
 */
export const metadata: Metadata = {
  title: 'Printable Project Plan',
  description: 'Printable outdoor project plan with dimensions, materials, quantities, waste, costs, assumptions and a shopping list.',
  robots: { index: false, follow: true },
};

export default function ProjectPrintLayout({ children }: { children: ReactNode }) {
  return children;
}
