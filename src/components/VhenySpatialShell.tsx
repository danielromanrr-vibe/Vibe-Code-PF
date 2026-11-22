const LIST_ROWS = 8;
const SHEET_ROWS = 5;

export default function VhenySpatialShell() {
  return (
    <div className="vg-loop vg-loop--shell" aria-hidden>
      <div className="vheny-shell__canvas">
        <div className="vheny-shell__rail">
          <span className="vheny-shell__mod vs-h vs-h--nav-contacts" title="Contacts">
            <svg viewBox="0 0 24 24" aria-hidden>
              <circle cx="12" cy="8" r="3.1" fill="currentColor" />
              <path
                d="M5.2 19.4c.9-3.3 3.5-5 6.8-5s5.9 1.7 6.8 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="vheny-shell__mod vs-h vs-h--nav-stock" title="Stock">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M12 3.2 L20.2 12 L12 20.8 L3.8 12 Z" fill="currentColor" />
            </svg>
          </span>
        </div>
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
            <div className="vheny-shell__detail">
              <div className="vheny-shell__detail-head">
                <span className="vheny-shell__switch vs-h vs-h--switch">
                  <i />
                </span>
                <span className="vheny-shell__avatar" />
                <span className="vheny-shell__namebar" />
              </div>
              <div className="vheny-shell__bodies">
                <div className="vheny-shell__profile vs-h vs-h--face-a">
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
                    </div>
                  </div>
                </div>
                <div className="vheny-shell__alt vs-h vs-h--face-b">
                  <span />
                  <span className="is-on" />
                  <span />
                  <span className="is-short" />
                </div>
              </div>
            </div>
            <div className="vheny-shell__linked">
              <div className="vheny-shell__linked-head">
                <span className="vheny-shell__namebar" />
                <span className="vheny-shell__kebab vs-h vs-h--kebab">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <span />
              <span />
              <span />
              <div className="vheny-shell__menu vs-h vs-h--menu">
                <span>Note</span>
                <span>Memo</span>
                <span>Edit</span>
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
            </span>
          </div>
          <div className="vheny-shell__sheet">
            <div className="vheny-shell__sheet-head">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} />
              ))}
            </div>
            {Array.from({ length: SHEET_ROWS }, (_, row) => (
              <div key={row} className="vheny-shell__sheet-row">
                <i />
                <span />
                <span />
                <span />
                <b />
              </div>
            ))}
          </div>
        </div>
        <span className="vheny-shell__cursor vs-h vs-h--cursor">
          <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden>
            <path
              d="M3 1.6 L3 14.8 L7.1 10.8 L10.4 16.2 L12.3 15.2 L9 9.8 L14.4 9.4 Z"
              fill="#2c3bb8"
              stroke="#fff"
              strokeWidth="1"
            />
          </svg>
          <i />
        </span>
      </div>
      <span className="vg-progress">
        <span className="vg-h vg-h--meter" />
      </span>
    </div>
  );
}
