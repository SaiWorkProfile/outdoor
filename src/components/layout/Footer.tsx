import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">MeasureToBuild</div>
          <div className="footer-tagline">Measure. Calculate. Plan.</div>
          <p>Practical planning tools for materials, quantities and project budgets. Estimates are planning aids, not engineering advice.</p>
        </div>
        <div>
          <strong>Calculators</strong>
          <Link href="/calculators">All calculators</Link>
          <Link href="/calculators/gravel-calculator">Gravel</Link>
          <Link href="/calculators/driveway-gravel-calculator">Driveway gravel</Link>
          <Link href="/calculators/fence-calculator">Fence</Link>
          <Link href="/calculators/paver-calculator">Paver</Link>
          <Link href="/calculators/concrete-calculator">Concrete</Link>
        </div>
        <div>
          <strong>Guides</strong>
          <Link href="/guides">All guides</Link>
          <Link href="/guides#cluster-projects">Project guides</Link>
          <Link href="/guides#cluster-materials">Material guides</Link>
          <Link href="/guides#cluster-costs">Cost guides</Link>
          <Link href="/projects/how-much-gravel-do-i-need">How much gravel?</Link>
          <Link href="/projects/how-to-plan-a-paver-patio">Plan a paver patio</Link>
        </div>
        <div>
          <strong>Resources</strong>
          <Link href="/projects">Project Mode</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/about">About</Link>
          <Link href="/about#contact">Contact</Link>
        </div>
        <div>
          <strong>Legal</strong>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} MeasureToBuild. Verify product quantities and local requirements with your supplier or qualified professional.</div>
    </footer>
  );
}
