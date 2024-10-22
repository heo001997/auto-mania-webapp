import { Runner } from '@/types/Runner';
import { Dataset } from '@/types/Dataset';
import React, { createContext } from 'react';

interface WorkflowContextType {
  workflow: any;
  setWorkflow: React.Dispatch<React.SetStateAction<any>>;
  currentActionId: string;
  runner: Runner;
  datasets: Dataset[];
}

export const WorkflowContext = createContext<WorkflowContextType>({
  workflow: {},
  setWorkflow: () => {},
  currentActionId: '',
  runner: {
    id: 0,
    name: '',
    workflowId: 0,
    deviceId: '0',
    data: [],
    updatedAt: new Date(),
    createdAt: new Date()
  },
  datasets: [],
});
