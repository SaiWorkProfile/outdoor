
          <section id="defaults" aria-labelledby="defaults-heading">
            <h2 id="defaults-heading">Central defaults</h2>
            <p>
              Every value below comes from the single assumptions file the engine reads. Where a calculator exposes
              an override, the override is shown next to the result it affected.
            </p>
            <div className="assumption-list">
              {GENERAL_ROWS.map(([label, value]) => (
                <div className="assumption-row" key={label}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <div className="table-wrap">
              <table className="content-table">
                <caption>Material planning densities and bag sizes</caption>
                <thead>
                  <tr>
                    <th scope="col">Material</th>
                    <th scope="col">Density (tons per yd³)</th>
                    <th scope="col">Bag sizes (ft³)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ENGINE_ASSUMPTIONS.materials).map(([name, spec]) => (
                    <tr key={name}>
                      <th scope="row">{name}</th>
                      <td>
                        {spec.densityTonsPerCuYd.typical} typical ({spec.densityTonsPerCuYd.min}–
                        {spec.densityTonsPerCuYd.max} range)
                      </td>
                      <td>{spec.bagSizesCuFt.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="table-note">
                Densities are planning defaults for the named material; supplier products vary. Enter your
                supplier&apos;s figures where the calculator allows it.
              </p>
            </div>
          </section>
