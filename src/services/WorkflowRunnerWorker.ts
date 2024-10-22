import { databaseService } from './DatabaseService';
import WorkflowRunnerService from './WorkflowRunnerService';

const ctx: Worker = self as any;

ctx.onmessage = async (event) => {
  const { workflow, device, runner } = event.data;
  console.log("WorkflowRunnerWorker runner: ", runner)
  const datasets = await databaseService.datasets.getAllDatasets();
  const service = new WorkflowRunnerService(workflow, device, runner, datasets);
  const result = await service.execute();
  ctx.postMessage(result);
};
