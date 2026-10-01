
          <section id="sources" aria-labelledby="sources-heading">
            <h2 id="sources-heading">Sources</h2>
            <p>
              These are the external references cited across the guide library — published extension guidance and
              material reference material used to sanity-check the defaults above. Each guide cites the specific
              source where a claim is checkable.
            </p>
            <ul className="sources">
              {SOURCES.map((source) => (
                <li key={source.url}>
                  <a href={source.url} rel="nofollow noopener" target="_blank">
                    {source.label}
                  </a>
                  <span className="source-note">{source.note}</span>
                </li>
              ))}
            </ul>
            <p className="subtle">
              These references support general background only. Product data, local requirements and site
              conditions take precedence over anything published here.
            </p>
          </section>

          <section id="limits" aria-labelledby="limits-heading">
            <h2 id="limits-heading">Limitations</h2>
            <div className="limits-card">
              <h3>Where this estimate stops being useful</h3>
              <p>
                Densities, product yields, packaging, compaction behaviour, site conditions and local requirements
                vary, and this site cannot see any of them. Estimates are planning aids for ordering conversations —
                not structural engineering, property surveying, code review or manufacturer instructions, which
                remain required where they apply. Confirm quantities with your supplier before purchase, and have a
                qualified professional confirm anything structural, drainage-related or permit-dependent.
              </p>
            </div>
            <p>
              The <Link href="/about">about page</Link> explains what the platform does and does not do, and the{' '}
              <Link href="/how-it-works">how it works page</Link> walks through the workflow end to end.
            </p>
          </section>
        </div>

        <aside className="sticky-shell">
          <nav className="content-toc" aria-labelledby="methodology-toc-heading">
            <h2 id="methodology-toc-heading">On this page</h2>
            <ol>
              {TOC.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`}>{entry.label}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="cta-card">
            <h2>Try it with your own numbers</h2>
            <p>Every calculator shows which assumptions applied to your result — and lets you override them.</p>
            <div className="content-actions">
              <Link className="button button-primary" href="/calculators">Browse calculators</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
