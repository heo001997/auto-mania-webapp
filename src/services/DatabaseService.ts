import Dexie, { Table } from 'dexie';
import { Dataset, NewDataset } from '@/types/Dataset';
import { Workflow, NewWorkflow } from '@/types/Workflow';

class AppDatabase extends Dexie {
  datasets!: Table<Dataset>;
  workflows!: Table<Workflow>;

  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      datasets: '++id, name, type, data, updatedAt, createdAt',
      workflows: '++id, name, data, updatedAt, createdAt'
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

  async createWorkflow(workflow: NewWorkflow): Promise<number> {
    const now = new Date();
    return await db.workflows.add({
      ...workflow,
      updatedAt: now,
      createdAt: now,
    });
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return await db.workflows.get(id);
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    return await db.workflows.toArray();
  }

  async updateWorkflow(id: number, workflow: Partial<Workflow>): Promise<number> {
    const now = new Date();
    return await db.workflows.update(id, { ...workflow, updatedAt: now });
  }

  async deleteWorkflow(id: number): Promise<void> {
    await db.workflows.delete(id);
  }

  async searchWorkflows(query: string): Promise<Workflow[]> {
    return await db.workflows
      .filter(workflow => workflow.name.toLowerCase().includes(query.toLowerCase()))
      .toArray();
  }
}

export const databaseService = new DatabaseService();
