export interface Workflow {
  id: number;
  name: string;
  data: object;
  updatedAt: Date;
  createdAt: Date;
}

export interface SerializableWorkflow extends Omit<Workflow, 'updatedAt' | 'createdAt'> {
  updatedAt: string;
  createdAt: string;
}

export type NewWorkflow = Omit<Workflow, 'id' | 'updatedAt' | 'createdAt'>;
