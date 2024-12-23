import React from 'react';
import { Duty } from '@/types/duty';
import { formatDateTime } from '@/utils/dateUtils';
import styles from './DutyCard.module.css';
import { Clock, Calendar, MapPin, Timer } from 'lucide-react';

interface DutyCardProps {
  duty: Duty;
  onClick: () => void;
}

export const DutyCard: React.FC<DutyCardProps> = ({ duty, onClick }) => {
  const start = formatDateTime(duty.start);
  const end = formatDateTime(duty.end);

  const calculateDuration = () => {
    const [startHour, startMin] = start.time.split(':').map(Number);
    const [endHour, endMin] = end.time.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
  };

  return (
    <div
      className={styles.card}
      onClick={onClick}
      data-testid={`duty-${duty.id}`}
    >
      <h3 className={styles.title}>{duty.name}</h3>
      <p className={styles.depot}>
        <MapPin className={styles.lucide} />
        {duty.depot}
        </p>
      <p className={styles.info}>
        <Calendar className={styles.lucide} />
        Date: {start.date}
        </p>
      <p className={styles.info}>
        <Clock className={styles.lucide} />
        Time: {start.time} - {end.time}
        </p>
      <p className={styles.info}>
       <Timer className={styles.lucide} />
        Duration: {calculateDuration()}
        </p>
    </div>
  );
};