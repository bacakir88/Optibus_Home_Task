import { Duty } from '../types/duty';
import { DutyValidationError  } from '../types/dutyValidationError';

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

const checkTimeOverlap = (duty: Duty, existingDuties: Duty[]): boolean => {
  const dutyStart = new Date(duty.start).getTime();
  const dutyEnd = new Date(duty.end).getTime();

  return existingDuties.some(existingDuty => {
    const existingStart = new Date(existingDuty.start).getTime();
    const existingEnd = new Date(existingDuty.end).getTime();

    return (
      (dutyStart >= existingStart && dutyStart < existingEnd) ||
      (dutyEnd > existingStart && dutyEnd <= existingEnd) ||
      (dutyStart <= existingStart && dutyEnd >= existingEnd)
    );
  });
};

const checkRestPeriodViolation = (duty: Duty, existingDuties: Duty[]): boolean => {
  const dutyStart = new Date(duty.start).getTime();
  const dutyEnd = new Date(duty.end).getTime();

  return existingDuties.some(existingDuty => {
    const existingStart = new Date(existingDuty.start).getTime();
    const existingEnd = new Date(existingDuty.end).getTime();

    const restAfterNew = dutyEnd + EIGHT_HOURS_MS;
    const restBeforeNew = dutyStart - EIGHT_HOURS_MS;

    return (
      (existingStart > dutyEnd && existingStart <= restAfterNew) ||
      (existingEnd > restBeforeNew && existingEnd <= dutyStart)
    );
  });
};

export const checkDutyConflicts = (duty: Duty, existingDuties: Duty[]): DutyValidationError => {
  if (checkTimeOverlap(duty, existingDuties)) {
    return "OVERLAP"
  }

  if (checkRestPeriodViolation(duty, existingDuties)) {
    return "INSUFFICIENT_REST"
  }

  return null;
};