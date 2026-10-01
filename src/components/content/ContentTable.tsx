import type { TableSpec } from '@/content/types';
import type { CurrencyTextValue } from '@/lib/currency/money-value';
import { CurrencyRichText } from '@/components/currency/CurrencyText';

export interface Row {
  label: string;
  value: CurrencyTextValue;
  note?: CurrencyTextValue;
}

/** Simple label/value list used by the quick-answer panel and worked examples. */
export function AnswerList({ rows }: { rows: Row[] }) {
  return (
    <dl className="answer-list">
      {rows.map((row, i) => (
        <div className="answer-row" key={`${row.label}-${i}`}>
          <dt>{row.label}</dt>
          <dd>
            <CurrencyRichText value={row.value} />
            {row.note ? <span className="content-link-note"><CurrencyRichText value={row.note} /></span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Accessible data table. The first cell of each row is a row header. */
export function ContentTable({ table }: { table: TableSpec }) {
  return (
    <div className="table-wrap">
      <table className="content-table">
        {table.caption ? <caption>{table.caption}</caption> : null}
        <thead>
          <tr>
            {table.head.map((cell) => (
              <th scope="col" key={cell}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th scope="row" key={cellIndex}>
                    <CurrencyRichText value={cell} />
                  </th>
                ) : (
                  <td key={cellIndex}><CurrencyRichText value={cell} /></td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {table.note ? <p className="table-note">{table.note}</p> : null}
    </div>
  );
}
