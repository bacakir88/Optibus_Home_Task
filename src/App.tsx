import React from 'react';
import { DutyList } from './components/DutyList/DutyList';
import { useDutyManagement } from './hooks/useDutyManagement';
import dutiesData from './data.json';
import styles from './App.module.css';

const App: React.FC = () => {
  const {
    availableDuties,
    assignedDuties,
    assignDuty,
    unassignDuty
  } = useDutyManagement(dutiesData);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Driver Duty Management</h1>
      </header>
      <main className={styles.main}>
        <DutyList
          duties={availableDuties}
          onDutyClick={assignDuty}
          title="Available Duties"
        />
        <DutyList
          duties={assignedDuties}
          onDutyClick={unassignDuty}
          title="Assigned Duties"
        />
      </main>
    </div>
  );
};

export default App;