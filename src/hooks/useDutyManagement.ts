import { useState } from 'react';
import { Duty } from '../types/duty';
import { checkDutyConflicts } from '../utils/dutyValidation';

const ERROR_MESSAGES = {
  OVERLAP: 'Overlapping duties are not allowed',
  INSUFFICIENT_REST: 'Minimum 8-hour rest period required between duties'
}

interface UseDutyManagement {
  availableDuties: Duty[];
  assignedDuties: Duty[];
  assignDuty: (duty: Duty) => void;
  unassignDuty: (duty: Duty) => void;
}

export const useDutyManagement = (initialDuties: Duty[]): UseDutyManagement => {
  const [availableDuties, setAvailableDuties] = useState<Duty[]>(initialDuties);
  const [assignedDuties, setAssignedDuties] = useState<Duty[]>([]);

  const assignDuty = (duty: Duty) => {
    const isConflict = checkDutyConflicts(duty, assignedDuties);

    if (isConflict) {
      alert(ERROR_MESSAGES[isConflict])
      return;
    }

    setAvailableDuties(prev => prev.filter(d => d.id !== duty.id));
    setAssignedDuties(prev => [...prev, duty]);
  };

  const unassignDuty = (duty: Duty) => {
    setAssignedDuties(prev => prev.filter(d => d.id !== duty.id));
    setAvailableDuties(prev => 
      [...prev, duty].sort((a, b) => a.id - b.id)
    );
  };

  return {
    availableDuties,
    assignedDuties,
    assignDuty,
    unassignDuty
  };
};