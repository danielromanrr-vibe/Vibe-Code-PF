const LIST_ROWS = 11;
const SHEET_ROWS = 6;
const SCHEMA_WIDTHS = [
  ['78%', '62%', '88%', '48%', '70%'],
  ['52%', '84%', '40%', '73%', '60%'],
  ['90%', '46%', '68%', '82%', '36%'],
] as const;

export default function VhenySpatialShell() {
  return (
    <figure className="vheny-shell">
      <div
        className="vheny-shell__canvas"
        role="img"
        aria-label="One shell for Contacts and Stock. Hover plays two changes with no labels. A control in the list covers the split with a full table, then the split returns. Controls on the detail card then swap what that card shows, while the list and the lower panel stay."
      >
        <div className="vheny-shell__loop">
          <div className="vheny-shell__rail" aria-hidden>
            <i className="is-on" />
            <i />
            <i />
            <i />
            <i />
            <i className="is-end" />
          </div>
          <div className="vheny-shell__stage" aria-hidden>
            <div className="vheny-shell__split">
              <div className="vheny-shell__list">
                <div className="vheny-shell__list-head">
                  <span className="vheny-shell__search" />
                  <span className="vheny-shell__list-toggle vs-h vs-h--list">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <div className="vheny-shell__rows">
                  {Array.from({ length: LIST_ROWS }, (_, index) => (
                    <div key={index} className={index === 1 ? 'vheny-shell__row is-selected' : 'vheny-shell__row'}>
                      <span className="vheny-shell__mark" />
                      <span className="vheny-shell__track" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="vheny-shell__stack">
                <div className="vheny-shell__detail">
                  <div className="vheny-shell__detail-head">
                    <span className="vheny-shell__avatar" />
                    <span className="vheny-shell__namebar" />
                    <span className="vheny-shell__card-toggle vs-h vs-h--card">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                  <div className="vheny-shell__bodies">
                    <div className="vheny-shell__profile vs-h vs-h--profile">
                      <div className="vheny-shell__fields">
                        <span />
                        <span />
                        <span className="is-wide" />
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="vheny-shell__notes">
                        <span className="vheny-shell__note" />
                        <div className="vheny-shell__tags">
                          <i />
                          <i />
                          <i />
                          <i />
                        </div>
                      </div>
                    </div>
                    <div className="vheny-shell__related vs-h vs-h--related">
                      <div className="vheny-shell__pips">
                        <i className="vs-h vs-h--pip1" />
                        <i className="vs-h vs-h--pip2" />
                        <i className="vs-h vs-h--pip3" />
                      </div>
                      <div className="vheny-shell__schemas">
                        {SCHEMA_WIDTHS.map((widths, schema) => (
                          <div key={schema} className={`vheny-shell__schema vs-h vs-h--sch${schema + 1}`}>
                            {widths.map((width, row) => (
                              <span key={row} className="vheny-shell__schema-row">
                                <i />
                                <b style={{ width }} />
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="vheny-shell__linked">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <div className="vheny-shell__table vs-h vs-h--table">
              <div className="vheny-shell__table-head">
                <span className="vheny-shell__types">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="vheny-shell__list-toggle is-hot">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="vheny-shell__sheet">
                <div className="vheny-shell__sheet-head">
                  {Array.from({ length: 6 }, (_, index) => (
                    <span key={index} />
                  ))}
                </div>
                {Array.from({ length: SHEET_ROWS }, (_, row) => (
                  <div key={row} className="vheny-shell__sheet-row">
                    <i />
                    <span />
                    <span />
                    <span />
                    <span />
                    <b />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <span className="vheny-shell__meter vs-h vs-h--meter" aria-hidden>
            <span />
          </span>
        </div>
      </div>
    </figure>
  );
}
