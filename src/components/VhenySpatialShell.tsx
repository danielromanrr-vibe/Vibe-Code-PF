const LIST_ROWS = 11;
const SHEET_ROWS = 6;

export default function VhenySpatialShell() {
  return (
    <figure className="vheny-shell">
      <div
        className="vheny-shell__canvas"
        role="img"
        aria-label="One shell. Hover plays four changes. The left rail switches between Contacts and Stock. A control at the top left of the list expands a full table to the right, then the split returns. A control at the top left of the detail grows that card downward and pushes the lower card down. A control at the top right of the lower card then opens an action surface for that contact."
      >
        <div className="vheny-shell__loop">
          <div className="vheny-shell__rail" aria-hidden>
            <i className="vs-h vs-h--nav-contacts" />
            <i className="vs-h vs-h--nav-stock" />
            <i />
            <i />
            <i />
            <i className="is-end" />
          </div>
          <div className="vheny-shell__stage" aria-hidden>
            <div className="vheny-shell__split">
              <div className="vheny-shell__list">
                <div className="vheny-shell__list-head">
                  <span className="vheny-shell__list-toggle vs-h vs-h--list">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="vheny-shell__search" />
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
                <div className="vheny-shell__detail vs-h vs-h--detail">
                  <div className="vheny-shell__detail-head">
                    <span className="vheny-shell__card-toggle vs-h vs-h--card">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="vheny-shell__avatar" />
                    <span className="vheny-shell__namebar" />
                  </div>
                  <div className="vheny-shell__bodies">
                    <div className="vheny-shell__profile">
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
                  </div>
                </div>
                <div className="vheny-shell__linked vs-h vs-h--linked">
                  <div className="vheny-shell__linked-head">
                    <span className="vheny-shell__namebar" />
                    <b className="vheny-shell__act vs-h vs-h--act" />
                  </div>
                  <span />
                  <span />
                  <span />
                  <div className="vheny-shell__act-sheet vs-h vs-h--sheet">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
            <div className="vheny-shell__table vs-h vs-h--table">
              <div className="vheny-shell__table-head">
                <span className="vheny-shell__list-toggle is-hot">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="vheny-shell__types">
                  <i />
                  <i />
                  <i />
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
