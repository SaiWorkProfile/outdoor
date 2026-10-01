import Link from 'next/link';
import { BrandMarkIcon, FolderIcon } from '../ui/icons';
import { CurrencySelector } from '../currency/CurrencySelector';

export function Header() {
  return <header className="site-header"><div className="site-header-inner"><Link href="/" className="brand"><span className="brand-mark"><BrandMarkIcon size={22}/></span><span><strong>MeasureToBuild</strong><small>Measure. Calculate. Plan.</small></span></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/calculators">Calculators</Link><Link href="/projects">Projects</Link><Link href="/guides">Guides</Link><Link href="/how-it-works">How It Works</Link><Link href="/methodology">Methodology</Link><Link href="/about">About</Link></nav><CurrencySelector/><Link href="/projects" className="header-project-link"><FolderIcon size={17}/> Project</Link></div></header>;
}
