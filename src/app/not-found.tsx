import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: false } };

export default function NotFound() {
  return <div className="container section"><div className="card" style={{maxWidth:700,margin:'40px auto',textAlign:'center'}}><div className="eyebrow">404</div><h1>That page does not exist.</h1><p style={{color:'var(--muted)'}}>Use the calculator directory or return to the project planner home.</p><div className="hero-actions" style={{justifyContent:'center'}}><Link className="button button-primary" href="/calculators">Browse calculators</Link><Link className="button button-secondary" href="/">Go home</Link></div></div></div>;
}
