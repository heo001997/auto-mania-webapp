import { DatasetService } from './DatabaseDatasetService';
import { WorkflowService } from './DatabaseWorkflowService';
import { RunnerService } from './DatabaseRunnerService';
import Dexie, { Table } from 'dexie';
import { Workflow } from '@/types/Workflow';
import {Dataset} from "@/types/Dataset.ts";
import {Runner} from "@/types/Runner.ts";

export class AppDatabase extends Dexie {
  workflows!: Table<Workflow>;
  datasets!: Table<Dataset>;
  runners!: Table<Runner>;

  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      datasets: '++id, name, type, data, updatedAt, createdAt',
      workflows: '++id, name, data, edges, updatedAt, createdAt',
      runners: '++id, name, workflowId, data, updatedAt, createdAt'
    });
  }
}

export class DatabaseService {
  datasets: DatasetService;
  workflows: WorkflowService;
  runners: RunnerService;
  db: AppDatabase;

  constructor() {
    this.db = new AppDatabase();
    this.datasets = new DatasetService(this.db);
    this.workflows = new WorkflowService(this.db);
    this.runners = new RunnerService(this.db);
  }
}

export const databaseService = new DatabaseService();
