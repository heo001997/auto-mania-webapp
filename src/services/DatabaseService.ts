import Dexie, { Table } from 'dexie';
import { Dataset, NewDataset } from '@/types/Dataset';

class AppDatabase extends Dexie {
  datasets!: Table<Dataset>;

  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      datasets: '++id, name, type, data, updatedAt, createdAt'
    });
  }
}

const db = new AppDatabase();

export class DatabaseService {
  async createDataset(dataset: NewDataset): Promise<number> {
    const now = new Date();
    return await db.datasets.add({
      ...dataset,
      updatedAt: now,
      createdAt: now,
    });
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    return await db.datasets.get(id);
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return await db.datasets.toArray();
  }

  async updateDataset(id: number, updates: Partial<Omit<Dataset, 'id' | 'createdAt'>>): Promise<number> {
    const now = new Date();
    return await db.datasets.update(id, { ...updates, updatedAt: now });
  }

  async deleteDataset(id: number): Promise<void> {
    await db.datasets.delete(id);
  }

  async searchDatasets(query: string): Promise<Dataset[]> {
    return await db.datasets
      .filter(dataset => dataset.name.toLowerCase().includes(query.toLowerCase()))
      .toArray();
  }
}

export const databaseService = new DatabaseService();
