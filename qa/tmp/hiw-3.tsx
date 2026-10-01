
          <section id="prices" aria-labelledby="prices-heading">
            <h2 id="prices-heading">9. Your prices only — no ads, no invented costs</h2>
            <p>
              The site does not publish current market prices, because it has no live feed of them. Cost fields use
              the prices you enter; a missing price is shown as &quot;Price not entered&quot; and excluded from the
              total rather than filled with a guess. A cost total is only ever as current as the numbers you gave
              it.
            </p>
            <p>
              There is no advertising anywhere on the site: no ad slots, no sponsored calculators and no trackers.
              The only money figures on the page are the ones you typed.
            </p>
          </section>

          <section id="storage" aria-labelledby="storage-heading">
            <h2 id="storage-heading">10. Your project stays in your browser</h2>
            <p>
              Project Mode persists to your browser&apos;s local storage — no account, no server, no sync. Nothing
              about your project is transmitted anywhere, and printing the plan works entirely on your machine.
              Clearing the project deletes the data, because there is no copy anywhere else. The{' '}
              <Link href="/privacy">privacy page</Link> spells out exactly what is stored.
            </p>
          </section>

          <section id="content" aria-labelledby="content-heading">
            <h2 id="content-heading">11. Guides are built from the same material</h2>
            <p>
              The <Link href="/guides">guide library</Link> — project, material and cost guides — is content data
              rendered through one accessible template. Its worked examples call the engine, its claims link to
              their sources where a claim is checkable, and every guide ends with what it cannot tell you. No page
              is given authority it has not earned: no fake bylines, no review scores, no invented statistics.
            </p>
          </section>

          <section id="limits" aria-labelledby="limits-heading">
            <h2 id="limits-heading">12. What the site will not do</h2>
            <p>
              It will not tell you a structure is safe, that a permit is not required, that a supplier will accept
              an order quantity, or what your project will cost at today&apos;s prices. Those decisions involve
              local code, site conditions and market information that a calculator cannot see. The site does the
              arithmetic honestly and tells you where its knowledge stops — then the{' '}
              <Link href="/methodology">methodology page</Link> and <Link href="/about">about page</Link> document
              both in full.
            </p>
          </section>
        </div>

        <aside className="sticky-shell">
          <nav className="content-toc" aria-labelledby="hiw-toc-heading">
            <h2 id="hiw-toc-heading">On this page</h2>
            <ol>
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.label}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="cta-card">
            <h2>Built-in principles</h2>
            <ul className="copy-list">
              <li>No fabricated current prices.</li>
              <li>No formula duplication in UI code.</li>
              <li>Assumptions remain inspectable.</li>
              <li>No ads, accounts or trackers.</li>
              <li>Project Mode needs no backend.</li>
            </ul>
            <div className="content-actions">
              <Link className="button button-primary" href="/calculators">Try a calculator</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
