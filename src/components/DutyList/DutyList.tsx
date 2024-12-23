import React from 'react';
import { Duty } from '../../types/duty';
import { DutyCard } from '../DutyCard/DutyCard';
import styles from './DutyList.module.css';

interface DutyListProps {
  duties: Duty[];
  onDutyClick: (duty: Duty) => void;
  title: string;
}

export const DutyList: React.FC<DutyListProps> = ({ duties, onDutyClick, title }) => (
  <div className={styles.container}>
    <h2 className={styles.title}>{title} ({duties.length})</h2>
    <div className={styles.duties}>
      {duties.map(duty => (
        <DutyCard
          key={duty.id}
          duty={duty}
          onClick={() => onDutyClick(duty)}
        />
      ))}
    </div>
  </div>
);