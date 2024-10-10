export interface Dataset {
  id: number;
  name: string;
  type: string;
  data: object[];
  updatedAt: Date;
  createdAt: Date;
}

export interface SerializableDataset extends Omit<Dataset, 'updatedAt' | 'createdAt'> {
  updatedAt: string;
  createdAt: string;
}

export type NewDataset = Omit<Dataset, 'id' | 'updatedAt' | 'createdAt'>;
