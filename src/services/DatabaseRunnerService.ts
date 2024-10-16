import Dexie, { Table } from 'dexie';
import { Runner, NewRunner } from '@/types/Runner';
import { AppDatabase } from './DatabaseService';

export class RunnerService {
  private db: AppDatabase;

  constructor(db: AppDatabase) {
    this.db = db;
  }

  async createRunner(runner: NewRunner): Promise<number> {
    const now = new Date();
    return await this.db.runners.add({
      ...runner,
      updatedAt: now,
      createdAt: now,
    });
  }

  async getRunner(id: number): Promise<Runner | undefined> {
    return await this.db.runners.get(id);
  }

  async getAllRunners(): Promise<Runner[]> {
    return await this.db.runners.toArray();
  }

  async updateRunner(id: number, runner: Partial<Runner>): Promise<number> {
    const now = new Date();
    return await this.db.runners.update(id, { ...runner, updatedAt: now });
  }

  async deleteRunner(id: number): Promise<void> {
    await this.db.runners.delete(id);
  }

  async searchRunners(query: string): Promise<Runner[]> {
    return await this.db.runners
      .filter(runner => runner.name.toLowerCase().includes(query.toLowerCase()))
      .toArray();
  }
}
