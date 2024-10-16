import Dexie, { Table } from 'dexie';
import { Workflow, NewWorkflow } from '@/types/Workflow';
import { AppDatabase } from './DatabaseService';

export class WorkflowService {
  private db: AppDatabase;

  constructor(db: AppDatabase) {
    this.db = db;
  }

  async createWorkflow(workflow: NewWorkflow): Promise<number> {
    const now = new Date();
    return await this.db.workflows.add({
      ...workflow,
      updatedAt: now,
      createdAt: now,
    });
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return await this.db.workflows.get(id);
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    return await this.db.workflows.toArray();
  }

  async updateWorkflow(id: number, workflow: Partial<Workflow>): Promise<number> {
    const now = new Date();
    return await this.db.workflows.update(id, { ...workflow, updatedAt: now });
  }

  async deleteWorkflow(id: number): Promise<void> {
    await this.db.workflows.delete(id);
  }

  async searchWorkflows(query: string): Promise<Workflow[]> {
    return await this.db.workflows
      .filter(workflow => workflow.name.toLowerCase().includes(query.toLowerCase()))
      .toArray();
  }
}
