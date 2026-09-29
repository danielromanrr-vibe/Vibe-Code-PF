import React, { createContext, useContext } from 'react';
import { MapPin, MessageSquare, Phone, UserRound } from 'lucide-react';
import type { Driver } from '../types';
import { firstName, telHref } from '../lib/volunteer';
import { Button, ButtonLink } from './ui';

export interface VolunteerActionsApi {
  openTextDraft: (driverId: string, schoolId?: string | null) => void;
  openProfile: (driverId: string) => void;
  locateOnMap: (driverId: string) => void;
  canLocate: (driver: Driver) => boolean;
}

const noop = () => {};
export const VolunteerActionsContext = createContext<VolunteerActionsApi>({
  openTextDraft: noop,
  openProfile: noop,
  locateOnMap: noop,
  canLocate: () => false,
});

export function useVolunteerActions() {
  return useContext(VolunteerActionsContext);
}

/**
 * Call is a real tel: link. Text Draft opens an editable message; nothing is
 * sent from here. Hoyt still makes the call.
 */
export function VolunteerActions({
  driver,
  variant = 'bar',
  contextSchoolId,
}: {
  driver: Driver;
  variant?: 'bar' | 'compact' | 'quiet';
  contextSchoolId?: string | null;
}) {
  const api = useVolunteerActions();
  const name = firstName(driver);

  if (variant === 'quiet') {
    return (
      <div className="flex items-center gap-1">
        <ButtonLink variant="quiet" icon={Phone} href={telHref(driver)} aria-label={`Call ${driver.name}`}>
          Call {name}
        </ButtonLink>
        <Button variant="quiet" icon={MessageSquare} onClick={() => api.openTextDraft(driver.id, contextSchoolId)}>
          Text Draft
        </Button>
      </div>
    );
  }

  const locatable = api.canLocate(driver);
  const homeBaseOnly = driver.assignedTo.length === 0;

  return (
    <div className="flex items-center gap-1.5">
      <ButtonLink variant="card" icon={Phone} href={telHref(driver)} className="flex-1" aria-label={`Call ${driver.name}`}>
        Call
      </ButtonLink>
      <Button
        variant="card"
        icon={MessageSquare}
        className="flex-1"
        aria-label={`Text draft for ${driver.name}`}
        onClick={() => api.openTextDraft(driver.id, contextSchoolId)}
      >
        {variant === 'compact' ? 'Text' : 'Text Draft'}
      </Button>
      {variant === 'compact' ? (
        <Button
          variant="card"
          icon={UserRound}
          className="flex-1"
          aria-label={`Open profile for ${driver.name}`}
          onClick={() => api.openProfile(driver.id)}
        >
          Profile
        </Button>
      ) : (
        // Disabled buttons swallow hover, so the explanation lives on the wrapper.
        <span
          className="flex-1 flex"
          title={!locatable ? 'No route or home base yet' : homeBaseOnly ? 'Shows their home-base school' : undefined}
        >
          <Button
            variant="card"
            icon={MapPin}
            className="flex-1"
            disabled={!locatable}
            aria-label={`Show ${driver.name} on the map`}
            onClick={() => api.locateOnMap(driver.id)}
          >
            Show on Map
          </Button>
        </span>
      )}
    </div>
  );
}
