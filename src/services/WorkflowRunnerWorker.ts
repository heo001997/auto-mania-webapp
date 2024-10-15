import WorkflowRunnerService from './WorkflowRunnerService';

const ctx: Worker = self as any;

ctx.onmessage = async (event) => {
  const { workflow, device } = event.data;
  const runner = new WorkflowRunnerService(workflow, device);
  const result = await runner.execute();
  ctx.postMessage(result);
};
