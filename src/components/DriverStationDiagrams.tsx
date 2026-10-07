type StationDiagramProps = {
  reducedMotion: boolean;
};

function DayRail({ start, end }: { start: string; end: string }) {
  return (
    <div className="driver-station__rail">
      <span className="driver-station__day">{start}</span>
      <span className="driver-station__track" aria-hidden="true">
        <span className="driver-station__playhead" />
      </span>
      <span className="driver-station__day driver-station__day--end">{end}</span>
    </div>
  );
}

/** Monday through Wednesday noon. One pulse, a filling meter, quiet routes marked at the hold. */
export function StationRsvpDiagram({ reducedMotion }: StationDiagramProps) {
  return (
    <figure className={`driver-station-figure${reducedMotion ? ' is-held' : ''}`}>
      <div
        className="driver-station driver-station--rsvp"
        role="img"
        aria-label="Monday through Wednesday noon. One RSVP pulse goes out. Two routes confirm availability, capacity, and an extra stop, and the meter fills. The route with no reply is marked at risk at Wednesday 12:00 PM."
      >
        <DayRail start="Mon" end="Wed 12:00" />
        <div className="driver-station__send">
          <span className="driver-station__pulse">Send pulse</span>
          <span className="driver-station__message">RSVP</span>
        </div>
        <div className="driver-station__meter">
          <span className="driver-station__meter-label">Confirmations</span>
          <span className="driver-station__meter-track">
            <span className="driver-station__meter-fill" />
          </span>
        </div>
        <ul className="driver-station__routes">
          <li className="driver-station__route driver-station__route--a">
            <span className="driver-station__route-id">01</span>
            <span className="driver-station__route-name">Route</span>
            <span className="driver-station__route-state">
              <span className="is-tentative">Tentative</span>
              <span className="is-covered">Covered</span>
            </span>
            <span className="driver-station__reply">Available · capacity · extra stop</span>
          </li>
          <li className="driver-station__route driver-station__route--b">
            <span className="driver-station__route-id">02</span>
            <span className="driver-station__route-name">Route</span>
            <span className="driver-station__route-state">
              <span className="is-tentative">Tentative</span>
              <span className="is-covered">Covered</span>
            </span>
            <span className="driver-station__reply">Available · capacity · extra stop</span>
          </li>
          <li className="driver-station__route driver-station__route--quiet">
            <span className="driver-station__route-id">03</span>
            <span className="driver-station__route-name">Route</span>
            <span className="driver-station__route-state">
              <span className="is-tentative">Tentative</span>
              <span className="is-risk">At risk</span>
            </span>
          </li>
        </ul>
      </div>
      <figcaption className="driver-station__caption">
        Quiet routes are marked at the Wednesday 12:00 PM risk horizon.
      </figcaption>
    </figure>
  );
}

/** Thursday through Friday. Confirmed routes print as slips, then one slip matches an open trunk. */
export function StationDockDiagram({ reducedMotion }: StationDiagramProps) {
  return (
    <figure className={`driver-station-figure${reducedMotion ? ' is-held' : ''}`}>
      <div
        className="driver-station driver-station--dock"
        role="img"
        aria-label="Confirmed routes print as color-coded slips with a bag count. At the loading bay, staff match a slip to the open trunk. The route with no reply does not print."
      >
        <ul className="driver-dock__slips">
          <li className="driver-dock__slip driver-dock__slip--blue">
            <span className="driver-dock__swatch" aria-hidden="true" />
            <span className="driver-dock__id">01</span>
            <span className="driver-dock__ink">
              <span className="driver-dock__code">Blue</span>
              <span className="driver-dock__count">6 bags</span>
            </span>
            <span className="driver-dock__route">Route</span>
          </li>
          <li className="driver-dock__slip driver-dock__slip--green">
            <span className="driver-dock__swatch" aria-hidden="true" />
            <span className="driver-dock__id">02</span>
            <span className="driver-dock__ink">
              <span className="driver-dock__code">Green</span>
              <span className="driver-dock__count">4 bags</span>
            </span>
            <span className="driver-dock__route">Route</span>
          </li>
          <li className="driver-dock__slip driver-dock__slip--quiet">
            <span className="driver-dock__swatch" aria-hidden="true" />
            <span className="driver-dock__id">03</span>
            <span className="driver-dock__ink">
              <span className="driver-dock__code">No slip</span>
            </span>
            <span className="driver-dock__route">Quiet</span>
          </li>
        </ul>
        <div className="driver-dock__floor">
          <p className="driver-dock__queue">
            <span>Bay</span>
            <i />
            <i />
          </p>
          <div className="driver-dock__trunk" aria-hidden="true">
            <span className="driver-dock__trunk-label">Trunk</span>
            {Array.from({ length: 6 }, (_, index) => (
              <i key={index} className="driver-dock__bag" />
            ))}
          </div>
        </div>
      </div>
      <figcaption className="driver-station__caption">
        A printed slip tells the dock which bags go in that trunk.
      </figcaption>
    </figure>
  );
}
