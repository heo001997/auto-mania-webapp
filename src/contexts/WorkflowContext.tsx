import React, { createContext } from 'react';

interface WorkflowContextType {
  workflow: any;
  setWorkflow: React.Dispatch<React.SetStateAction<any>>;
  currentActionId: string;
}

export const WorkflowContext = createContext<WorkflowContextType>({
  workflow: {},
  setWorkflow: () => {},
  currentActionId: '',
});