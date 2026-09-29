import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  X,
  Send,
  ChevronDown,
  Package,
  GraduationCap,
  Car,
  ShieldAlert,
  Filter,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Zap,
  MapPin,
  Printer,
} from 'lucide-react';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

import type { Driver, OperationalMode, School } from './types';
import { getCoverageStats, getSchoolStatus } from './lib/status';
import { HQ_COORDS, INITIAL_DRIVERS, INITIAL_SCHOOLS, SCHOOL_COORDS } from './data';
import { shortSchoolName } from './lib/volunteer';
import { getDistance } from './lib/geo';
import { applyStack, applySwap, type AssignMode } from './lib/assign';
import { firstName } from './lib/volunteer';
import { SchoolPopupCard } from './components/SchoolPopupCard';
import { NetworkPanel } from './components/NetworkPanel';
import { ProfileSheet } from './components/ProfileSheet';
import { NewVolunteerSheet } from './components/NewVolunteerSheet';
import { Button, Sheet } from './components/ui';
import { RouteConsequenceSheet } from './components/RouteConsequenceSheet';
import { TextDraftSheet } from './components/TextDraftSheet';
import { VolunteerActionsContext } from './components/VolunteerActions';

type PendingAssignment = { driverId: string; schoolId: string; mode: AssignMode } | null;
import { Z } from './lib/tokens';
import { SHEET_SPRING } from './components/ui';
import {
  buildClusterHtml,
  buildSitePinHtml,
  buildWarehouseHtml,
  cachedDivIcon,
  glassClass,
  toneFor,
  type MapTone,
  type Tier,
} from './lib/markers';

// --- Components ---

const SUCCESS_TOAST = /(added to|resolved|complete|copied|registered|assigned|confirmed|swapped)/i;

const Toast = ({ message, onClear }: { message: string, onClear: () => void }) => {
  const onClearRef = useRef(onClear);
  onClearRef.current = onClear;

  useEffect(() => {
    const timer = setTimeout(() => onClearRef.current(), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 12, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%', transition: SHEET_SPRING }}
      exit={{ opacity: 0, y: 12, x: '-50%', transition: { duration: 0.15 } }}
      style={{ zIndex: Z.toast }}
      className="glass-dark fixed bottom-6 left-1/2 h-10 px-4 rounded-full flex items-center gap-2 text-[13px] font-medium tracking-[-0.012em] text-white whitespace-nowrap shadow-[0_8px_32px_-12px_rgba(12,21,40,0.18)]"
    >
      {SUCCESS_TOAST.test(message) ? <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" aria-hidden="true" /> : null}
      <span>{message}</span>
    </motion.div>
  );
};

// --- Spatial Clusters & Progressive Disclosure ---

interface ZoneCluster {
  zone: string;
  centroid: [number, number];
  bounds: [[number, number], [number, number]];
  schools: School[];
  totalCount: number;
  gapCount: number;
  coveredCount: number;
  atRiskCount: number;
  displayCount: number;
  filterMode: 'all' | 'gaps' | 'covered';
}

const ZoomWatcher = ({ 
  onZoomChange,
  mapRef
}: { 
  onZoomChange: (z: number) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
}) => {
  const map = useMap();
  
  useEffect(() => {
    mapRef.current = map;
    onZoomChange(map.getZoom());
  }, [map, onZoomChange, mapRef]);

  useMapEvents({
    zoomend: (e) => {
      onZoomChange(e.target.getZoom());
    },
  });
  return null;
};

const ClusterMarker = ({
  cluster,
  isRSVPRequested,
  tone,
}: {
  cluster: ZoneCluster;
  isRSVPRequested: boolean;
  tone: MapTone;
  key?: React.Key;
}) => {
  const map = useMap();
  const html = buildClusterHtml(cluster, { isRSVPRequested, tone });
  const openCount = cluster.gapCount;
  const status = cluster.filterMode === 'covered'
    ? `${cluster.displayCount} covered ${cluster.displayCount === 1 ? 'site' : 'sites'}`
    : isRSVPRequested
      ? openCount > 0 ? `${openCount} open ${openCount === 1 ? 'route' : 'routes'}` : 'All routes covered'
      : 'Standby · awaiting RSVPs';

  const ariaLabel = `${cluster.zone}, ${cluster.totalCount} schools, ${status}`;

  return (
    <Marker
      ref={(marker: L.Marker | null) => marker?.getElement()?.setAttribute('aria-label', ariaLabel)}
      position={cluster.centroid}
      zIndexOffset={2000}
      eventHandlers={{
        click: () => {
          map.flyToBounds(cluster.bounds, { padding: [70, 70], maxZoom: 14, duration: 1.2 });
        },
        add: (e) => e.target.getElement()?.setAttribute('aria-label', ariaLabel),
      }}
      icon={cachedDivIcon('cluster-div-icon', html, [32, 32], [16, 16])}
    >
      <Tooltip className="map-tooltip" direction="top" offset={[0, -18]} opacity={1}>
        <MapTooltipCard tone={tone} title={cluster.zone} meta={`${cluster.totalCount} schools · ${status}`}>
          <span>Click to zoom into this zone</span>
        </MapTooltipCard>
      </Tooltip>
    </Marker>
  );
};

function MapTooltipCard({
  tone,
  title,
  status,
  meta,
  children,
}: {
  tone: MapTone;
  title: string;
  status?: { label: string; dot: string };
  meta?: string;
  children?: React.ReactNode;
}) {
  const dark = tone === 'dark';
  return (
    <div className={`${glassClass(tone)} rounded-xl px-3 py-2 min-w-[200px] max-w-[280px] text-left whitespace-normal ${dark ? 'text-white' : 'text-[#141414]'}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold tracking-[-0.02em] leading-tight">{title}</span>
        {status ? (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
            {status.label}
          </span>
        ) : null}
      </div>
      {meta ? <div className={`text-[12px] mt-0.5 ${dark ? 'text-white/70' : 'text-[#141414]/65'}`}>{meta}</div> : null}
      {children ? (
        <div className={`mt-1.5 pt-1.5 border-t text-[12px] flex flex-col gap-1 ${dark ? 'border-white/15 text-white/85' : 'border-[#141414]/[0.08] text-[#141414]/78'}`}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  const [schools, setSchools] = useState(INITIAL_SCHOOLS);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [currentZoom, setCurrentZoom] = useState<number>(11);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [activeGapId, setActiveGapId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<OperationalMode>('Standard');
  const [toast, setToast] = useState<string | null>(null);
  const [highlightedSchoolId, setHighlightedSchoolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDriverId, setShowProfileDriverId] = useState<string | null>(null);
  const [isRSVPRequested, setIsRSVPRequested] = useState(false);
  const [isAnimatingRSVP, setIsAnimatingRSVP] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0); // 0: M, 1: T, 2: W, 3: T, 4: F
  const [showResetModal, setShowResetModal] = useState(false);
  const [showNewDriverModal, setShowNewDriverModal] = useState(false);
  const rsvpIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAllSchools, setShowAllSchools] = useState(true);
  const [enableClustering, setEnableClustering] = useState(true);
  const [tileSource, setTileSource] = useState<'canvas' | 'dark' | 'satellite' | 'topo' | 'streets'>('canvas');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [legendFilter, setLegendFilter] = useState<'all' | 'gaps' | 'covered' | 'warehouse'>('all');
  const [openPopupId, setOpenPopupId] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const mapTone: MapTone = toneFor(tileSource);
  // During a recovery the zone capsules would sit on top of the candidate pins.
  const showClusters = enableClustering && currentZoom <= 11 && !activeGapId;

  // Pins stagger outward from their zone's centroid, so the cluster reads as having opened.
  const zoneRank = useMemo(() => {
    const byZone: Record<string, School[]> = {};
    INITIAL_SCHOOLS.forEach(s => { (byZone[s.zone] ??= []).push(s); });
    const rank: Record<string, number> = {};
    Object.values(byZone).forEach(zSchools => {
      const pts = zSchools.map(s => SCHOOL_COORDS[s.id]);
      const c: [number, number] = [
        pts.reduce((a, p) => a + p[0], 0) / pts.length,
        pts.reduce((a, p) => a + p[1], 0) / pts.length,
      ];
      [...zSchools]
        .sort((a, b) => getDistance(c[0], c[1], ...SCHOOL_COORDS[a.id]) - getDistance(c[0], c[1], ...SCHOOL_COORDS[b.id]))
        .forEach((s, i) => { rank[s.id] = i; });
    });
    return rank;
  }, []);

  const clearSelection = () => {
    setSelectedSchoolId(null);
    setActiveGapId(null);
    setActiveMode('Standard');
    setIsEditMode(false);
  };

  // --- Derived State ---
  const selectedSchool = useMemo(() => schools.find(s => s.id === selectedSchoolId), [schools, selectedSchoolId]);
  const activeGapSchool = useMemo(() => schools.find(s => s.id === activeGapId), [schools, activeGapId]);
  
  const selectedSchoolDistInfo = useMemo(() => {
    if (!selectedSchool) return null;
    const coords = SCHOOL_COORDS[selectedSchool.id];
    if (!coords) return null;
    const dist = getDistance(HQ_COORDS[0], HQ_COORDS[1], coords[0], coords[1]);
    return { dist, isLong: dist > 10 };
  }, [selectedSchool]);

  const statusCtx = useMemo(() => ({ isRSVPRequested, isAnimatingRSVP }), [isRSVPRequested, isAnimatingRSVP]);
  const schoolStatus = useMemo(() => {
    const map: Record<string, ReturnType<typeof getSchoolStatus>> = {};
    schools.forEach(s => { map[s.id] = getSchoolStatus(s, drivers, statusCtx); });
    return map;
  }, [schools, drivers, statusCtx]);

  const stats = useMemo(() => getCoverageStats(schools, drivers, statusCtx), [schools, drivers, statusCtx]);
  // Before RSVPs settle every site reads as standby, so "no gaps" alone isn't ready.
  const allRoutesReady =
    isRSVPRequested && !isAnimatingRSVP && schools.length > 0 && schools.every(s => schoolStatus[s.id] === 'covered');

  // Filter state flags
  const isGapsFilter = !showAllSchools || legendFilter === 'gaps';
  const isCoveredFilter = legendFilter === 'covered';
  const isWarehouseFilter = legendFilter === 'warehouse';

  // Spatial Clusters computed for Macro progressive disclosure with full filter awareness
  const clusters = useMemo(() => {
    if (isWarehouseFilter) return [];

    const filterMode: 'all' | 'gaps' | 'covered' = isGapsFilter ? 'gaps' : isCoveredFilter ? 'covered' : 'all';

    const zoneMap: Record<string, School[]> = {};
    schools.forEach(s => {
      if (!zoneMap[s.zone]) zoneMap[s.zone] = [];
      zoneMap[s.zone].push(s);
    });

    const result: ZoneCluster[] = [];

    Object.entries(zoneMap).forEach(([zone, zSchools]) => {
      let gapCount = 0;
      let coveredCount = 0;
      let atRiskCount = 0;

      const matchingSchools = zSchools.filter(s => {
        const status = schoolStatus[s.id];
        const isGap = status === 'gap';
        const isAtRisk = status === 'at-risk';

        if (isGap) gapCount++;
        else if (isAtRisk) atRiskCount++;
        else coveredCount++;

        if (filterMode === 'gaps') return isGap || isAtRisk;
        if (filterMode === 'covered') return !isGap && !isAtRisk;
        return true;
      });

      // When filtering to Gaps Only or Covered Sites, suppress zones that have 0 matching schools
      if (matchingSchools.length === 0) return;

      // Calculate centroid and bounds dynamically from the matching schools
      const validCoords = matchingSchools
        .map(s => SCHOOL_COORDS[s.id])
        .filter((c): c is [number, number] => !!c);

      if (validCoords.length === 0) return;

      const avgLat = validCoords.reduce((acc, c) => acc + c[0], 0) / validCoords.length;
      const avgLng = validCoords.reduce((acc, c) => acc + c[1], 0) / validCoords.length;

      let minLat = validCoords[0][0], maxLat = validCoords[0][0];
      let minLng = validCoords[0][1], maxLng = validCoords[0][1];

      validCoords.forEach(([lat, lng]) => {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      });

      // Bounding box with slight geographic buffer for clean flyToBounds framing
      const bounds: [[number, number], [number, number]] = [
        [minLat - 0.015, minLng - 0.02],
        [maxLat + 0.015, maxLng + 0.02]
      ];

      result.push({
        zone,
        centroid: [avgLat, avgLng],
        bounds,
        schools: zSchools,
        totalCount: zSchools.length,
        gapCount,
        coveredCount,
        atRiskCount,
        displayCount: matchingSchools.length,
        filterMode
      });
    });

    return result;
  }, [schools, schoolStatus, isGapsFilter, isCoveredFilter, isWarehouseFilter]);

  const tieredSchools = useMemo(() => {
    if (!activeGapId) return { tier1: [], tier2: [], tier3: [], distances: {} as Record<string, number>, radii: { r1: 0, r2: 0, r3: 0 } };
    
    const gapCoords = SCHOOL_COORDS[activeGapId];
    if (!gapCoords) return { tier1: [], tier2: [], tier3: [], distances: {} as Record<string, number>, radii: { r1: 0, r2: 0, r3: 0 } };

    // Covered schools with volunteer drivers stationed there
    const candidateSchools = schools
      .filter(s => s.id !== activeGapId && !!s.assignedDriver)
      .map(s => {
        const coords = SCHOOL_COORDS[s.id];
        const dist = coords ? getDistance(gapCoords[0], gapCoords[1], coords[0], coords[1]) : 999;
        return {
          ...s,
          distance: dist
        };
      })
      .sort((a, b) => a.distance - b.distance);

    const t1 = candidateSchools.slice(0, 3);
    const t2 = candidateSchools.slice(3, 6);
    const t3 = candidateSchools.slice(6, 10);

    const distMap: Record<string, number> = {};
    candidateSchools.forEach(c => { distMap[c.id] = c.distance; });

    const r1 = t1.length > 0 ? Math.max(2.5, t1[t1.length - 1].distance) : 2.5;
    const r2 = t2.length > 0 ? Math.max(r1 + 1.8, t2[t2.length - 1].distance) : r1 + 2.5;
    const r3 = t3.length > 0 ? Math.max(r2 + 2.2, t3[t3.length - 1].distance) : r2 + 3.0;

    return {
      tier1: t1.map(s => s.id),
      tier2: t2.map(s => s.id),
      tier3: t3.map(s => s.id),
      distances: distMap,
      radii: { r1, r2, r3 }
    };
  }, [schools, activeGapId]);

  // --- Actions ---
  const [pending, setPending] = useState<PendingAssignment>(null);

  const flashSchool = (schoolId: string) => {
    setHighlightedSchoolId(schoolId);
    setTimeout(() => setHighlightedSchoolId(prev => (prev === schoolId ? null : prev)), 1000);
  };

  const finishAssignment = (schoolId: string, toast: string) => {
    setToast(toast);
    setActiveGapId(null);
    mapInstanceRef.current?.closePopup();
    flashSchool(schoolId);
    setIsEditMode(false);
  };

  /** Stack (fresh or additional route). Never clears a route the driver already covers. */
  const handleAddStop = (driverId: string, schoolId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    const school = schools.find(s => s.id === schoolId);
    if (!driver || !school) return;
    const next = applyStack({ schools, drivers }, driverId, schoolId);
    if (!next) return;
    setSchools(next.schools);
    setDrivers(next.drivers);
    const routes = driver.assignedTo.length + 1;
    finishAssignment(schoolId, `${shortSchoolName(school.name)} added to ${firstName(driver)}’s route · ${routes} ${routes === 1 ? 'route' : 'routes'}`);
  };

  /** Swap: only reachable from the explicit second step in the consequence sheet. */
  const handleAssign = (driverId: string, schoolId: string, isReplacement = false) => {
    if (!isReplacement) return handleAddStop(driverId, schoolId);
    const driver = drivers.find(d => d.id === driverId);
    const school = schools.find(s => s.id === schoolId);
    if (!driver || !school) return;
    const vacated = schools.filter(s => s.assignedDriver === driver.name && s.id !== schoolId);
    const next = applySwap({ schools, drivers }, driverId, schoolId);
    if (!next) return;
    setSchools(next.schools);
    setDrivers(next.drivers);
    const opened = vacated.map(s => shortSchoolName(s.name)).join(', ');
    finishAssignment(schoolId, `${firstName(driver)} moved to ${shortSchoolName(school.name)}${opened ? ` · ${opened} is now open` : ''}`);
  };

  const pendingDriver = pending ? drivers.find(d => d.id === pending.driverId) : undefined;
  const pendingSchool = pending ? schools.find(s => s.id === pending.schoolId) : undefined;

  const requestAssignment = (driverId: string, schoolId: string) => {
    const d = drivers.find(x => x.id === driverId);
    if (!d) return;
    setPending({ driverId, schoolId, mode: d.assignedTo.length ? 'stack' : 'fresh' });
  };

  const confirmAssignment = (mode: AssignMode) => {
    if (!pending) return;
    if (mode === 'swap') handleAssign(pending.driverId, pending.schoolId, true);
    else handleAddStop(pending.driverId, pending.schoolId);
    setPending(null);
  };

  // --- Volunteer actions (shared by popup, network cards, profile, consequence sheet) ---
  const [textDraft, setTextDraft] = useState<{ driverId: string; schoolId: string | null } | null>(null);
  const textDraftDriver = textDraft ? drivers.find(d => d.id === textDraft.driverId) : undefined;
  const textDraftSchool = textDraft?.schoolId ? schools.find(s => s.id === textDraft.schoolId) : null;

  const locateTargetOf = (d: Driver): string | null => {
    const routeId = d.assignedTo.find(id => SCHOOL_COORDS[id]);
    if (routeId) return routeId;
    return d.profileSchoolId && SCHOOL_COORDS[d.profileSchoolId] ? d.profileSchoolId : null;
  };

  const skipAutoFlyRef = useRef(false);
  const locateCleanupRef = useRef<(() => void) | null>(null);

  const locateOnMap = (driverId: string) => {
    const d = drivers.find(x => x.id === driverId);
    const target = d ? locateTargetOf(d) : null;
    const map = mapInstanceRef.current;
    if (!d || !target || !map) return;

    locateCleanupRef.current?.();
    setShowProfileDriverId(null);
    setLegendFilter('all');
    setShowAllSchools(true);
    setActiveMode('Standard');
    skipAutoFlyRef.current = selectedSchoolId !== target;
    setSelectedSchoolId(target);
    map.closePopup();

    // The marker only mounts after the selection re-renders, so open on arrival.
    let fallback: ReturnType<typeof setTimeout>;
    const open = () => {
      clearTimeout(fallback);
      map.off('moveend', open);
      locateCleanupRef.current = null;
      markerRefs.current[target]?.openPopup();
    };
    map.once('moveend', open);
    fallback = setTimeout(open, 1600);
    locateCleanupRef.current = () => {
      clearTimeout(fallback);
      map.off('moveend', open);
    };

    const stops = d.assignedTo.map(id => SCHOOL_COORDS[id]).filter(Boolean);
    if (stops.length > 1) {
      map.flyToBounds(L.latLngBounds(stops).pad(0.35), { maxZoom: 14, duration: 1.2 });
    } else {
      map.flyTo(SCHOOL_COORDS[target], 14, { duration: 1.2 });
    }
    setToast(`Showing ${firstName(d)} on the map`);
  };

  useEffect(() => () => locateCleanupRef.current?.(), []);

  const volunteerActions = {
    // The gap being recovered is the most useful ask; otherwise the caller's school.
    openTextDraft: (driverId: string, schoolId?: string | null) =>
      setTextDraft({ driverId, schoolId: activeGapId ?? schoolId ?? null }),
    openProfile: (driverId: string) => setShowProfileDriverId(driverId),
    locateOnMap,
    canLocate: (d: Driver) => locateTargetOf(d) !== null,
  };

  const findVolunteerFor = (schoolId: string) => {
    setActiveGapId(schoolId);
    setSelectedSchoolId(schoolId);
    setActiveMode('Network');
    const map = mapInstanceRef.current;
    const coords = SCHOOL_COORDS[schoolId];
    if (!map || !coords) return;
    map.closePopup();
    // Keep the gap visible beside the 420px panel instead of underneath it.
    const zoom = map.getZoom();
    map.panTo(map.unproject(map.project(coords, zoom).add([222, 0]), zoom), { duration: 0.6 });
  };

  const reviewNearbyRoutes = (schoolId: string) => {
    setActiveGapId(schoolId);
    const map = mapInstanceRef.current;
    if (!map) return;
    map.closePopup();
    const center = SCHOOL_COORDS[schoolId];
    const radiusMeters = Math.max(tieredSchools.radii.r1 || 2.5, 2) * 1609.34;
    map.flyToBounds(L.latLng(center).toBounds(radiusMeters * 2), { padding: [48, 48], maxZoom: 14, duration: 1.1 });
  };

  const handleRequestRSVPs = () => {
    if (isAnimatingRSVP) return;

    setIsRSVPRequested(true);
    // Initialize all eligible drivers to 'pending' - default state starts at none confirmed
    setDrivers(prev => prev.map(d => d.profileSchoolId ? { ...d, RSVPStatus: 'pending' } : d));
    
    setToast("RSVP requests sent");
    startRSVPAnimation();
  };

  const startRSVPAnimation = () => {
    if (isAnimatingRSVP) return;
    setIsAnimatingRSVP(true);

    let step = 0;
    const totalSteps = 60; // 6 seconds at 100ms intervals
    
    rsvpIntervalRef.current = setInterval(() => {
      step++;
      
      // Linear progression from Monday (0) to Thursday (3) over the 6 seconds
      // 0-15: Monday, 16-30: Tuesday, 31-45: Wednesday, 46-60: Thursday
      if (step <= 15) {
        setCurrentDayIndex(0);
      } else if (step <= 30) {
        setCurrentDayIndex(1);
      } else if (step <= 45) {
        setCurrentDayIndex(2);
      } else {
        setCurrentDayIndex(3);
      }

      if (step >= totalSteps) {
        if (rsvpIntervalRef.current) clearInterval(rsvpIntervalRef.current);
        setIsAnimatingRSVP(false);
        
        // Final state: Ensure exactly 87 are 'yes' and 3 specific schools are gaps
        setDrivers(prev => {
          const gapDriverIds = ['d02', 'd06', 'd27']; // Drivers for sc01, sc02, sc18
          
          const updatedDrivers = prev.map(d => {
            if (!d.profileSchoolId) return d;
            if (gapDriverIds.includes(d.id)) {
              return { ...d, RSVPStatus: 'no' as const };
            }
            return { ...d, RSVPStatus: 'yes' as const };
          });

          // AUTO-ASSIGNMENT LOGIC
          setTimeout(() => {
            setSchools(prevSchools => {
              const newSchools = [...prevSchools];
              const gapSchoolIds = ['sc01', 'sc02', 'sc18'];
              
              // Assign all schools EXCEPT the 3 gaps
              newSchools.forEach((s, idx) => {
                if (gapSchoolIds.includes(s.id)) return;
                
                // Find the driver profiled for this school (who now said 'yes')
                const driver = updatedDrivers.find(d => d.profileSchoolId === s.id && d.RSVPStatus === 'yes');
                if (driver) {
                  newSchools[idx] = { 
                    ...s, 
                    assignedDriver: driver.name,
                    autoAssigned: true 
                  };
                }
              });

              setDrivers(prevD => prevD.map(d => {
                const assignedSchool = newSchools.find(s => s.assignedDriver === d.name);
                if (assignedSchool) return { ...d, assignedTo: [assignedSchool.id] };
                return d;
              }));

              return newSchools;
            });
            setToast("Auto-assignment complete (3 gaps remaining)");
          }, 500);

          return updatedDrivers;
        });
        return;
      }

      // Resolve drivers in waves
      if (step % 5 === 0) {
        setDrivers(prev => {
          const pendingDrivers = prev.filter(d => d.RSVPStatus === 'pending');
          if (pendingDrivers.length === 0) return prev;

          const numToResolve = Math.ceil(pendingDrivers.length * 0.2);
          const idsToResolve = pendingDrivers
            .sort(() => Math.random() - 0.5)
            .slice(0, numToResolve)
            .map(d => d.id);

          return prev.map(d => {
            if (idsToResolve.includes(d.id)) {
              // During animation, favor 'yes' to trend towards 85%
              return { ...d, RSVPStatus: Math.random() > 0.2 ? 'yes' : 'no' };
            }
            return d;
          });
        });
      }
    }, 100);
  };


  const handleReset = () => {
    if (rsvpIntervalRef.current) {
      clearInterval(rsvpIntervalRef.current);
      rsvpIntervalRef.current = null;
    }
    setIsAnimatingRSVP(false);
    setIsRSVPRequested(false);
    setCurrentDayIndex(0);
    setActiveGapId(null);
    setSelectedSchoolId(null);
    mapInstanceRef.current?.closePopup();
    setSchools(prev => prev.map(s => ({ ...s, assignedDriver: null, autoAssigned: false, emailSent: false })));
    setDrivers(prev => prev.map(d => ({ ...d, assignedTo: [], RSVPStatus: 'pending' })));
    setShowResetModal(false);
    setToast("All assignments reset");
  };

  const handleAddDriver = (newDriver: Driver) => {
    setDrivers(prev => [newDriver, ...prev]);
    setToast(`${newDriver.name} added to the network`);
  };

  return (
    <VolunteerActionsContext.Provider value={volunteerActions}>
    <div className="h-screen w-screen overflow-hidden bg-neutral-100 font-sans text-neutral-900 flex flex-col relative">
      {/* --- BACKGROUND MAP (Primary Interface) --- */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <MapContainer 
          key={tileSource}
          center={HQ_COORDS} 
          zoom={11} 
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {tileSource === 'canvas' && (
            <TileLayer 
              attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
          )}
          {tileSource === 'dark' && (
            <TileLayer 
              attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
          )}
          {tileSource === 'satellite' && (
            <TileLayer 
              attribution='Tiles &copy; Esri &mdash; Earthstar Geographics'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          )}
          {tileSource === 'topo' && (
            <TileLayer 
              attribution='Tiles &copy; Esri &mdash; USGS, NOAA'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
          )}
          {tileSource === 'streets' && (
            <TileLayer 
              attribution='Tiles &copy; Esri &mdash; Sources: GEBCO, USGS, Garmin, HERE'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
          )}
          <MapAutoController 
            selectedSchoolId={selectedSchoolId} 
            isGap={!!selectedSchoolId && schoolStatus[selectedSchoolId] === 'gap'} 
            skipRef={skipAutoFlyRef}
          />
          <ZoomWatcher onZoomChange={setCurrentZoom} mapRef={mapInstanceRef} />
          <MapClickHandler onClear={clearSelection} />
          
          {/* --- CENTRAL WAREHOUSE / HQ ANCHOR --- */}
          <Marker
            position={HQ_COORDS}
            zIndexOffset={3000}
            eventHandlers={{
              click: () => setToast('Backpack Warehouse · SODO HQ'),
              add: (e) => e.target.getElement()?.setAttribute('aria-label', 'Backpack Warehouse, SODO HQ'),
            }}
            icon={cachedDivIcon('warehouse-div-icon', buildWarehouseHtml(), [32, 32], [16, 16])}
          >
            <Tooltip className="map-tooltip" direction="top" offset={[0, -18]} opacity={1}>
              <MapTooltipCard tone={mapTone} title="Backpack Warehouse" meta="SODO HQ · supply depot and driver dispatch" />
            </Tooltip>
          </Marker>

          {/* --- LEVEL 1: ZONE CLUSTERS (zoom <= 11) --- */}
          {showClusters && clusters.map(cluster => (
            <ClusterMarker
              key={`${cluster.zone}-${cluster.filterMode}-${cluster.displayCount}`}
              cluster={cluster}
              isRSVPRequested={isRSVPRequested}
              tone={mapTone}
            />
          ))}

          {/* --- LEVELS 2 & 3: SCHOOL SITES --- */}
          {schools.map(s => {
            const coords = SCHOOL_COORDS[s.id];
            if (!coords) return null;

            const isSelected = selectedSchoolId === s.id;
            const status = schoolStatus[s.id];
            const isAtRisk = status === 'at-risk';
            const isGap = status === 'gap';

            const tier1 = tieredSchools.tier1.includes(s.id);
            const tier2 = tieredSchools.tier2.includes(s.id);
            const tier3 = tieredSchools.tier3.includes(s.id);
            const isTierCandidate = tier1 || tier2 || tier3;
            const tier: Tier | null = tier1 ? 1 : tier2 ? 2 : tier3 ? 3 : null;

            if (legendFilter === 'gaps' && !isGap && !isAtRisk) return null;
            if (legendFilter === 'covered' && isGap) return null;
            if (legendFilter === 'warehouse') return null;

            // Clusters stand in for sites at macro zoom, except the selection and live candidates.
            if (showClusters && !isSelected && !isTierCandidate) {
              return null;
            }

            const isVisible = showAllSchools || isGap || isTierCandidate || isSelected;
            if (!isVisible) return null;

            const dist = tieredSchools.distances[s.id] || 0;
            const level = isSelected || isTierCandidate || currentZoom >= 14 ? 'detail' : 'compact';
            const zIndex = isSelected ? 3000 : isTierCandidate ? 2200 : isGap ? 1800 : 800;
            const assignedDriver = s.assignedDriver ? drivers.find(d => d.name === s.assignedDriver) : undefined;
            const gapShortName = activeGapSchool ? shortSchoolName(activeGapSchool.name) : 'the gap';

            const html = buildSitePinHtml(s, status, {
              level,
              tier,
              dist,
              tone: mapTone,
              index: zoneRank[s.id] ?? 0,
              isRSVPRequested,
              highlighted: highlightedSchoolId === s.id,
            });

            const statusLabel = isGap
              ? { label: isRSVPRequested ? 'Route open' : 'Awaiting RSVPs', dot: isRSVPRequested ? 'bg-red-500' : 'bg-slate-400' }
              : isAtRisk
                ? { label: 'At risk', dot: 'bg-amber-500' }
                : { label: 'Covered', dot: 'bg-emerald-500' };
            const TierIcon = tier1 ? Zap : tier2 ? MapPin : Car;

            return (
              <Marker
                key={s.id}
                ref={(marker: L.Marker | null) => {
                  if (marker) {
                    markerRefs.current[s.id] = marker;
                    marker.getElement()?.setAttribute('aria-label', `${s.name}, ${statusLabel.label}`);
                  } else {
                    delete markerRefs.current[s.id];
                  }
                }}
                position={coords}
                zIndexOffset={zIndex}
                alt={s.name}
                keyboard
                eventHandlers={{
                  click: () => {
                    setSelectedSchoolId(s.id);
                    if (isGap || isAtRisk) {
                      setActiveGapId(s.id);
                    }
                  },
                  add: (e) => e.target.getElement()?.setAttribute('aria-label', `${s.name}, ${statusLabel.label}`),
                  popupopen: () => setOpenPopupId(s.id),
                  popupclose: () => setOpenPopupId(prev => (prev === s.id ? null : prev)),
                }}
                icon={cachedDivIcon('custom-div-icon', html, [28, 28], [14, 14])}
              >
                {openPopupId !== s.id && (
                  <Tooltip className="map-tooltip" direction="top" offset={[0, -16]} opacity={1}>
                    <MapTooltipCard
                      tone={mapTone}
                      title={s.name}
                      status={statusLabel}
                      meta={`${s.day} · ${s.time} · ${s.zone}`}
                    >
                      {isTierCandidate ? (
                        <span className="flex items-center gap-1.5">
                          <TierIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          Tier {tier} · {dist.toFixed(1)} mi from {gapShortName}
                        </span>
                      ) : null}
                      {assignedDriver ? (
                        <span className="flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          {assignedDriver.name} · {assignedDriver.vehicle.type}
                        </span>
                      ) : isGap && isRSVPRequested ? (
                        <span>Route open — needs a volunteer</span>
                      ) : null}
                    </MapTooltipCard>
                  </Tooltip>
                )}

                {/* --- DISCLOSED CARD --- */}
                <Popup
                  offset={[0, -12]}
                  className="custom-popup"
                  closeButton={false}
                  minWidth={300}
                  maxWidth={300}
                  autoPanPaddingTopLeft={[24, 148]}
                  autoPanPaddingBottomRight={[24, 24]}
                >
                  <SchoolPopupCard
                    school={s}
                    status={status}
                    driver={assignedDriver}
                    schools={schools}
                    statusCtx={statusCtx}
                    tier={activeGapId ? tier : null}
                    dist={dist}
                    gapSchool={activeGapSchool}
                    onRequestAssignment={requestAssignment}
                    onFindVolunteer={findVolunteerFor}
                    onReviewNearby={reviewNearbyRoutes}
                    onOpenProfile={setShowProfileDriverId}
                  />
                </Popup>
              </Marker>
            );
          })}

          {/* Contextual Drivers removed in favor of spatial school tiers */}
          
          {/* Tier Visualization Circles */}
          {activeGapId && (
            <>
              <Circle 
                center={SCHOOL_COORDS[activeGapId]} 
                radius={tieredSchools.radii.r3 * 1609.34} 
                pathOptions={{ fillColor: '#064e3b', fillOpacity: 0.04, color: '#065f46', weight: 1, dashArray: '6, 8', interactive: false }} 
              />
              <Circle 
                center={SCHOOL_COORDS[activeGapId]} 
                radius={tieredSchools.radii.r2 * 1609.34} 
                pathOptions={{ fillColor: '#059669', fillOpacity: 0.06, color: '#059669', weight: 1.5, dashArray: '4, 6', interactive: false }} 
              />
              <Circle 
                center={SCHOOL_COORDS[activeGapId]} 
                radius={tieredSchools.radii.r1 * 1609.34} 
                pathOptions={{ fillColor: '#22c55e', fillOpacity: 0.10, color: '#22c55e', weight: 2, interactive: false }} 
              />
            </>
          )}
        </MapContainer>
      </div>
      {/* --- TOP LEFT HUD STACK --- */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2.5 items-start">
        {/* --- COMMAND BAR (Unified Navigation & Filters) --- */}
        <div className="glass-light h-11 p-1 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
          {/* Operational Modes */}
          <div className="flex items-center gap-1 pr-2 border-r border-[#141414]/[0.08]">
            <button
              onClick={() => setActiveMode('Standard')}
              className={`h-9 px-3.5 rounded-full text-[13px] font-medium tracking-[-0.012em] transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                activeMode === 'Standard' 
                  ? 'bg-white text-[#141414] font-semibold shadow-xs border border-[#141414]/10' 
                  : 'text-[#141414]/78 hover:text-[#141414] hover:bg-black/[0.03]'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setActiveMode('Network')}
              className={`h-9 px-3.5 rounded-full text-[13px] font-medium tracking-[-0.012em] transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                activeMode === 'Network' 
                  ? 'bg-white text-[#141414] font-semibold shadow-xs border border-[#141414]/10' 
                  : 'text-[#141414]/78 hover:text-[#141414] hover:bg-black/[0.03]'
              }`}
            >
              Network
            </button>
          </div>

          {/* School Visibility Toggle */}
          <div className="flex items-center px-1.5 border-r border-[#141414]/[0.08]">
            <button
              onClick={() => setShowAllSchools(prev => !prev)}
              className={`h-9 px-3 rounded-full text-[13px] tracking-[-0.012em] flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                showAllSchools 
                  ? 'font-medium text-[#141414]/78 hover:text-[#141414] hover:bg-black/[0.03]' 
                  : 'font-semibold text-[#141414] bg-black/[0.04] hover:bg-black/[0.06]'
              }`}
            >
              {!showAllSchools ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5] text-[#0066cc]" />
              ) : (
                <Filter className="w-3.5 h-3.5 text-[#141414]/65" />
              )}
              <span>{showAllSchools ? 'All Sites' : 'Gaps Only'}</span>
            </button>
          </div>

          {/* RSVP Action & Simulation */}
          <div className="pl-1 pr-1">
            {!isRSVPRequested ? (
              <button 
                onClick={handleRequestRSVPs}
                className="h-9 px-3.5 rounded-full text-[13px] font-semibold tracking-[-0.012em] bg-[#0066cc] text-white hover:bg-[#0052a3] flex items-center gap-1.5 active:scale-[0.98] transition-all duration-200 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request RSVPs</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowResetModal(true)}
                className="h-9 px-3 rounded-full text-[13px] font-medium tracking-[-0.012em] text-[#141414]/65 hover:text-[#141414] hover:bg-black/[0.04] flex items-center gap-1.5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                title="Reset simulation state"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#141414]/50" />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>
        </div>

        {/* HUD Progress Bar */}
        <AnimatePresence mode="wait">
          {activeMode !== 'Network' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <ProgressHUD confirmed={stats.confirmed} total={stats.total} currentDayIndex={currentDayIndex} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* All routes covered notification in Gaps Only view */}
        <AnimatePresence>
          {isGapsFilter && stats.unresolved === 0 && isRSVPRequested && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              role="status"
              className="glass-light h-8 px-3.5 rounded-full flex items-center gap-1.5 text-[#141414] text-[12px] font-semibold tracking-[-0.012em] tabular-nums"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" aria-hidden="true" />
              <span>All {stats.total} routes covered · Zero gaps remaining</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- TOP RIGHT CONTROLS --- */}
      <div className="absolute top-6 right-6 z-[1000] flex items-center gap-2.5">
        <div className="relative">
          {/* Unified Settings Button (Apple Liquid Glass) */}
          <button
            onClick={() => setIsSettingsOpen(prev => !prev)}
            title="Map Settings"
            className="glass-light h-11 px-4 rounded-full flex items-center gap-2 text-[#141414] font-medium text-[13px] tracking-[-0.012em] hover:bg-[#F8F9FA]/90 active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#141414]/25 focus-visible:ring-offset-2 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#141414]/78" />
            <span>Map Settings</span>
            <span className="text-[#141414]/65 text-[12px] font-normal">
              · {tileSource === 'canvas' ? 'Canvas' : tileSource === 'dark' ? 'Dark' : tileSource === 'satellite' ? 'Satellite' : tileSource === 'topo' ? 'Topo' : 'Streets'}
            </span>
            {legendFilter !== 'all' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc]" />
            ) : (
              <ChevronDown className={`w-3.5 h-3.5 text-[#141414]/65 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-84 bg-white border border-[#141414]/[0.08] shadow-[0_8px_32px_-12px_rgba(12,21,40,0.18)] rounded-2xl p-4 z-[1100] flex flex-col gap-3.5 text-[#141414]"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-1 border-b border-[#141414]/[0.06]">
                  <div>
                    <div className="font-semibold text-[14px] text-[#141414] tracking-[-0.03em]">Map Settings</div>
                    <div className="text-[12px] text-[#141414]/65">Styles, layers, and route indicators</div>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#141414]/65 hover:bg-black/[0.04] transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Section 1: Street & Basemap Picker */}
                <div>
                  <div className="text-[11px] font-semibold text-[#141414]/65 uppercase tracking-wider mb-2">
                    Basemap Style
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F8F9FA] rounded-xl border border-[#141414]/[0.06]">
                    {[
                      { id: 'canvas', label: 'Canvas Light', desc: 'Minimal soft gray' },
                      { id: 'streets', label: 'Street Map', desc: 'Road network' },
                      { id: 'topo', label: 'Topographic', desc: 'Contours & terrain' },
                      { id: 'satellite', label: 'Satellite', desc: 'High-res aerial' },
                      { id: 'dark', label: 'Dark Mode', desc: 'Sleek night palette' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setTileSource(item.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-left transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                          tileSource === item.id 
                            ? 'bg-white text-[#141414] font-semibold shadow-xs border border-[#141414]/10' 
                            : 'text-[#141414]/78 hover:bg-black/[0.03]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] tracking-[-0.012em]">{item.label}</span>
                          {tileSource === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc]" />}
                        </div>
                        <div className="text-[10px] text-[#141414]/65 leading-tight">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] bg-[#141414]/[0.08]" />

                {/* Section: Spatial Clustering Toggle */}
                <div>
                  <div className="text-[11px] font-semibold text-[#141414]/65 uppercase tracking-wider mb-2">
                    Spatial Density
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F9FA] border border-[#141414]/[0.06]">
                    <div className="leading-tight pr-2">
                      <div className="text-[12.5px] font-medium text-[#141414]">Spatial Clustering</div>
                      <div className="text-[11px] text-[#141414]/65">Group sites into zone clusters when zoomed out</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={enableClustering}
                      onClick={() => setEnableClustering(prev => !prev)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        enableClustering ? 'bg-[#0066cc]' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          enableClustering ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="h-[1px] bg-[#141414]/[0.08]" />

                {/* Section 2: Legend & Route Status */}
                <div>
                  <div className="text-[11px] font-semibold text-[#141414]/65 uppercase tracking-wider mb-2">
                    Legend &amp; Route Status
                  </div>
                  <div className="space-y-1.5">
                    {/* Central Warehouse */}
                    <div 
                      onClick={() => setLegendFilter(prev => prev === 'warehouse' ? 'all' : 'warehouse')}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        legendFilter === 'warehouse' ? 'bg-[#0066cc]/10 ring-1 ring-[#0066cc]' : 'hover:bg-[#F8F9FA]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-[#0c1528] text-amber-400 border border-white/20 shadow-xs flex items-center justify-center shrink-0">
                          <Package className="w-3.5 h-3.5" />
                        </div>
                        <div className="leading-tight">
                          <div className="text-[12.5px] font-medium text-[#141414]">Backpack Warehouse (HQ)</div>
                          <div className="text-[11px] text-[#141414]/65">Central supply depot &amp; dispatch</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#141414]/65 bg-[#F8F9FA] px-2 py-0.5 rounded-full border border-[#141414]/[0.06]">
                        1 Hub
                      </span>
                    </div>

                    {/* Unresolved Route Gap */}
                    <div 
                      onClick={() => setLegendFilter(prev => prev === 'gaps' ? 'all' : 'gaps')}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        legendFilter === 'gaps' ? 'bg-red-500/10 ring-1 ring-red-500' : 'hover:bg-[#F8F9FA]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-md bg-red-600 border border-white shadow-xs flex items-center justify-center rotate-45 shrink-0">
                          <ShieldAlert className="w-3 h-3 text-white -rotate-45" />
                        </div>
                        <div className="leading-tight">
                          <div className="text-[12.5px] font-medium text-[#141414]">Unresolved Route Gap</div>
                          <div className="text-[11px] text-[#141414]/65">Needs volunteer dispatch</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        {stats.unresolved} Gaps
                      </span>
                    </div>

                    {/* Covered School */}
                    <div 
                      onClick={() => setLegendFilter(prev => prev === 'covered' ? 'all' : 'covered')}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        legendFilter === 'covered' ? 'bg-[#0066cc]/10 ring-1 ring-[#0066cc]' : 'hover:bg-[#F8F9FA]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-[#0c1528] text-slate-100 border border-white/20 shadow-xs flex items-center justify-center shrink-0">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-100" />
                        </div>
                        <div className="leading-tight">
                          <div className="text-[12.5px] font-medium text-[#141414]">Covered School Site</div>
                          <div className="text-[11px] text-[#141414]/65">Assigned driver scheduled</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#141414]/65 bg-[#F8F9FA] px-2 py-0.5 rounded-full border border-[#141414]/[0.06]">
                        {stats.confirmed} Sites
                      </span>
                    </div>

                    {/* Proximity Hierarchy (Green Cars) */}
                    <div className="pt-2">
                      <div className="text-[10.5px] font-semibold text-[#141414]/65 mb-1.5">
                        Volunteer Driver Proximity Tiers
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="p-1.5 rounded-lg bg-[#dcfce7] border border-[#22c55e]/40">
                          <div className="text-[11px] font-semibold text-[#15803d] flex items-center justify-center gap-1">
                            <Car className="w-3 h-3" />
                            <span>T1 &lt; 3mi</span>
                          </div>
                          <div className="text-[9px] text-[#166534]">Brightest</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-500/30">
                          <div className="text-[11px] font-medium text-emerald-800 flex items-center justify-center gap-1">
                            <Car className="w-3 h-3" />
                            <span>T2 3–6mi</span>
                          </div>
                          <div className="text-[9px] text-emerald-700">Medium</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#F8F9FA] border border-[#141414]/10">
                          <div className="text-[11px] font-medium text-[#141414]/78 flex items-center justify-center gap-1">
                            <Car className="w-3 h-3" />
                            <span>T3 6+mi</span>
                          </div>
                          <div className="text-[9px] text-[#141414]/65">Extended</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {legendFilter !== 'all' && (
                    <button
                      onClick={() => setLegendFilter('all')}
                      className="w-full mt-2.5 py-1.5 bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 text-[#0066cc] font-medium text-[12px] rounded-lg transition-colors flex items-center justify-center gap-1 active:scale-[0.98] cursor-pointer"
                    >
                      <span>Reset to All Entities</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <div className="glass-light h-11 px-4 rounded-full flex items-center text-[#141414]/78 font-medium text-[13px] tracking-[-0.012em] shadow-xs">
            <span>Week of Apr 16–24</span>
          </div>
          <AnimatePresence>
            {allRoutesReady && activeMode !== 'Network' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2.5"
              >
                <Button variant="primary" icon={Printer} className="h-11 px-4 shadow-[var(--shadow-control)]">
                  Print Artifacts
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- SIDEBAR OVERLAYS --- */}
      <AnimatePresence>
        {activeMode === 'Network' && (
          <NetworkPanel
            key="network-overlay"
            drivers={drivers}
            schools={schools}
            statusCtx={statusCtx}
            gapSchool={activeGapId ? schools.find(s => s.id === activeGapId) ?? null : null}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearGap={() => setActiveGapId(null)}
            onAddVolunteer={() => setShowNewDriverModal(true)}
            onAssign={requestAssignment}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast} onClear={() => setToast(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {pendingDriver && pendingSchool && (
          <RouteConsequenceSheet
            key={`${pending!.driverId}-${pending!.schoolId}`}
            driver={pendingDriver}
            school={pendingSchool}
            schools={schools}
            drivers={drivers}
            statusCtx={statusCtx}
            mode={pending!.mode}
            onModeChange={(mode) => setPending(prev => (prev ? { ...prev, mode } : prev))}
            onCancel={() => setPending(null)}
            onConfirm={confirmAssignment}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {textDraftDriver && (
          <TextDraftSheet
            key={`${textDraft!.driverId}-${textDraft!.schoolId ?? 'none'}`}
            driver={textDraftDriver}
            school={textDraftSchool}
            onClose={() => setTextDraft(null)}
            onCopied={() => setToast('Message copied')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileDriverId && drivers.some(d => d.id === showProfileDriverId) && (
          <ProfileSheet
            key={showProfileDriverId}
            driver={drivers.find(d => d.id === showProfileDriverId)!}
            schools={schools}
            statusCtx={statusCtx}
            onClose={() => setShowProfileDriverId(null)}
            onFixRouteRisk={(schoolId) => {
              setShowProfileDriverId(null);
              setActiveMode('Standard');
              setActiveGapId(schoolId);
              setSelectedSchoolId(schoolId);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResetModal && (
          <Sheet key="reset" onClose={() => setShowResetModal(false)} labelledBy="reset-title" className="max-w-sm">
            <div className="p-6">
              <h2 id="reset-title" className="text-[17px] font-semibold tracking-[-0.02em]">Reset assignments?</h2>
              <p className="text-[13px] text-[#141414]/65 mt-1.5">This clears every assignment and RSVP in the current draft.</p>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" data-autofocus onClick={() => setShowResetModal(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleReset}>Reset</Button>
              </div>
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      {/* --- Selection Clear --- */}
      {selectedSchoolId && activeMode !== 'Network' && (
        <div className="fixed bottom-6 right-6" style={{ zIndex: Z.mapChrome }}>
          <button
            onClick={clearSelection}
            className="glass-light h-9 px-3.5 rounded-full text-[13px] font-medium tracking-[-0.012em] text-[#141414] flex items-center gap-1.5 hover:bg-[#F8F9FA]/90 active:scale-[0.98] transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
          >
            <X className="w-4 h-4 text-[#141414]/65" aria-hidden="true" /> Clear selection
          </button>
        </div>
      )}

      <AnimatePresence>
        {showNewDriverModal && (
          <NewVolunteerSheet
            key="new-volunteer"
            schools={schools}
            onClose={() => setShowNewDriverModal(false)}
            onAdd={(driver) => {
              handleAddDriver(driver);
              setShowNewDriverModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
    </VolunteerActionsContext.Provider>
  );
}

// --- Sub-components ---

const MapClickHandler = ({ onClear }: { onClear: () => void }) => {
  useMapEvents({
    click: () => {
      onClear();
    },
  });
  return null;
};
function ProgressHUD({ confirmed, total, currentDayIndex }: { confirmed: number, total: number, currentDayIndex: number }) {
  const progress = (confirmed / total) * 100;
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState<number>(0);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  return (
    <div className="w-full h-11">
      <div className="glass-light p-1.5 rounded-full h-full flex items-center shadow-xs">
        <div ref={trackRef} className="relative flex-1 h-full bg-[#141414]/[0.06] rounded-full overflow-hidden">
          {/* Base Layer: Black ink text over light track (visible where blue bar has not reached) */}
          <div className="absolute inset-0 flex items-center justify-between px-3.5 select-none pointer-events-none">
            <span className="text-[#141414] font-medium text-[12px] tracking-[-0.012em] whitespace-nowrap">
              {confirmed}/{total} routes covered ({Math.round(progress)}%)
            </span>
          </div>

          {/* Progress Fill Layer: Clips pure white text to the expanding blue bar */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-[#0066cc] relative overflow-hidden"
          >
            <div 
              className="absolute top-0 bottom-0 left-0 flex items-center px-3.5 select-none pointer-events-none"
              style={{ width: trackWidth ? `${trackWidth}px` : '100%' }}
            >
              <span className="text-white font-medium text-[12px] tracking-[-0.012em] whitespace-nowrap">
                {confirmed}/{total} routes covered ({Math.round(progress)}%)
              </span>
            </div>
          </motion.div>

          {/* Weekday Status Indicators (Floating on right with persistent contrast) */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none z-10">
            <div className="flex gap-1 items-center pointer-events-auto">
              {['M', 'T', 'W', 'T', 'F'].map((day, i) => {
                const isActive = i === currentDayIndex;
                return (
                  <div key={i} className="relative w-5 h-5 flex items-center justify-center">
                    {isActive && (
                      <motion.div 
                        layoutId="activeDayIndicator"
                        className="absolute inset-0 bg-white rounded-md shadow-xs"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className={`relative z-10 text-[10.5px] font-semibold transition-colors duration-200 ${
                      isActive 
                        ? 'text-[#141414]' 
                        : progress > 85
                          ? 'text-white/70'
                          : 'text-[#141414]/40'
                    }`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MapAutoController = ({ selectedSchoolId, isGap, skipRef }: { selectedSchoolId: string | null, isGap: boolean, skipRef: React.MutableRefObject<boolean> }) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate size immediately and after layout pass to ensure full rendering in iframes/web views
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 600);
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  useEffect(() => {
    if (skipRef.current) {
      skipRef.current = false;
      return;
    }
    if (selectedSchoolId) {
      const coords = SCHOOL_COORDS[selectedSchoolId];
      if (coords) {
        // Zoom into Micro tier (14) to disclose full card
        map.flyTo(coords, 14, { duration: 1.4 });
      }
    }
  }, [selectedSchoolId, isGap, map]);
  return null;
};
