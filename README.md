# Driver Duty Management System

A React-based application for managing driver duties with schedule conflict prevention and rest period enforcement. This system helps transport operators efficiently assign and manage driver schedules while ensuring compliance with work regulations.

## Features

- **Duty Assignment**: Easily assign and unassign driver duties
- **Conflict Prevention**: Automatically checks for scheduling conflicts
- **Rest Period Enforcement**: Ensures minimum 8-hour rest periods between duties
- **Real-time Duration Display**: Shows duty duration calculations
- **Modern UI**: Clean, responsive interface with clear visual hierarchy
- **Type Safety**: Full TypeScript implementation for robust code quality

## Prerequisites

- Node.js
- npm or yarn
- TypeScript

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bacakir88/Optibus_Home_Task.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/
│   ├── DutyCard/
│   │   ├── DutyCard.tsx
│   │   └── DutyCard.module.css
│   └── DutyList/
│       ├── DutyList.tsx
│       └── DutyList.module.css
├── hooks/
│   └── useDutyManagement.ts
├── types/
│   └── duty.ts
│   └── dutyValidationError.ts
├── utils/
│   └── dateUtils.ts
│   └── dutyValidation.ts
├── App.tsx
└── App.module.css
```

## Key Components

### DutyCard
Displays individual duty information including:
- Duty ID/Name
- Location/Depot
- Date and time
- Duration

### DutyList
Manages the display of duty collections:
- Available duties
- Assigned duties
- Duty counts
- Assignment actions

### useDutyManagement Hook
Handles duty management logic:
- Duty assignment/unassignment
- Conflict checking
- Rest period validation
- State management

## Validation Rules

The system enforces two main validation rules:

1. **Overlap Prevention**: Prevents assigning duties that overlap in time
2. **Rest Period**: Ensures a minimum 8-hour rest period between duties

## Type Definitions

```typescript
interface Duty {
  id: number;
  name: string;
  depot: string;
  start: string;
  end: string;
}
```

## Styling

The application uses:
- CSS Modules for component-specific styling


## Development

To run tests:
```bash
npm test
# or
yarn test
```

To build for production:
```bash
npm run build
# or
yarn build
```