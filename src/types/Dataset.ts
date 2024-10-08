export interface Dataset {
  id: number;
  name: string;
  type: string;
  data: object;
  updatedAt: Date;
  createdAt: Date;
}

export type NewDataset = Omit<Dataset, 'id' | 'updatedAt' | 'createdAt'>;
