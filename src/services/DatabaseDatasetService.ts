import Dexie, { Table } from 'dexie';
import { Dataset, NewDataset } from '@/types/Dataset';
import { AppDatabase } from './DatabaseService';

export class DatasetService {
  private db: AppDatabase;

  constructor(db: AppDatabase) {
    this.db = db;
  }

  async createDataset(dataset: NewDataset): Promise<number> {
    const now = new Date();
    return await this.db.datasets.add({
      ...dataset,
      updatedAt: now,
      createdAt: now,
    });
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    return await this.db.datasets.get(id);
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return await this.db.datasets.toArray();
  }

  async updateDataset(id: number, updates: Partial<Omit<Dataset, 'id' | 'createdAt'>>): Promise<number> {
    const now = new Date();
    return await this.db.datasets.update(id, { ...updates, updatedAt: now });
  }

  async deleteDataset(id: number): Promise<void> {
    await this.db.datasets.delete(id);
  }

  async searchDatasets(query: string): Promise<Dataset[]> {
    return await this.db.datasets
      .filter(dataset => dataset.name.toLowerCase().includes(query.toLowerCase()))
      .toArray();
  }
}
