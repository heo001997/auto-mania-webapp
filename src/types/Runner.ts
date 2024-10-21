export interface RunnerData {
  variable: string;
  type: string;
  value: string;
}

export interface Runner {
  id: number;
  name: string;
  workflowId: number;
  deviceId: string;
  data: Array<RunnerData>;
  updatedAt: Date;
  createdAt: Date;
}

export interface SerializableRunner extends Omit<Runner, 'updatedAt' | 'createdAt'> {
  updatedAt: string;
  createdAt: string;
}

export type NewRunner = Omit<Runner, 'id' | 'updatedAt' | 'createdAt'>;
