import { Edge } from "@xyflow/react";

export interface Workflow {
  id: number;
  name: string;
  data: object;
  edges: [];
  updatedAt: Date;
  createdAt: Date;
}

export interface SerializableWorkflow extends Omit<Workflow, 'updatedAt' | 'createdAt'> {
  updatedAt: string;
  createdAt: string;
}

export type NewWorkflow = Omit<Workflow, 'id' | 'updatedAt' | 'createdAt'>;
