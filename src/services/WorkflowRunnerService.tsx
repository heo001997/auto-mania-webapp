import { Runner, RunnerData } from "@/types/Runner";
import { Device } from "../types/Device";
import ActionRunnerService from "./ActionRunnerService";
import { EnvService } from "./EnvService";
import { Dataset } from "@/types/Dataset";
import { databaseService } from "./DatabaseService";

export default class WorkflowRunnerService {
  private workflow: object;
  private device: Device;
  private actions: object[];
  private runnerData: RunnerData[];
  private datasets: Dataset[];
  private envService: EnvService;
  private variableValueMap: Record<string, string>;
  private datasetIdMap: Record<string, string>;
  private runner: Runner;

  constructor(workflow: object, device: Device, runner: Runner, datasets: Dataset[]) {
    this.workflow = workflow;
    this.device = device;
    this.actions = workflow.data || {};
    this.runner = runner;
    this.runnerData = runner.data;
    this.datasets = datasets;
    this.envService = new EnvService();
    this.variableValueMap = {};
    this.datasetIdMap = {};
  }

  async execute(): Promise<any> {
    try {
      console.log("runnerData: ", this.runnerData)
      console.log("this.workflow: ", this.workflow)
      console.log("actions: ", this.actions)
      const startNode = this.actions.start;
      console.log("startNode: ", startNode)

      // Create a map of dataset values
      this.datasetIdMap = this.envService.datasetIdMap(this.runnerData);
      this.variableValueMap = this.envService.variableValueMap(this.runnerData, this.datasets, this.datasetIdMap);
      const { success, result, error } = await this.runAllActions(startNode.data.successNode);

      return { success, result, error };
    } catch (error) {
      console.error("Error in execute", error);
      return { success: false, error: error };
    }
  }

  async runAllActions(actionId: string): Promise<{ success: boolean, result?: any, error?: any }> {
    try {
      const currentActionNode = this.actions[actionId];
      console.log("currentActionNode: ", currentActionNode)
      if (!currentActionNode) return { success: true, result: 'No more nextNode to execute, workflow finished!!!' }
      
      const currentAction = currentActionNode.data.action;
      console.log("currentAction: ", currentAction)

      let service;
      let serviceResult;
      if (currentAction.type === 'processData') {
        serviceResult = this.processDataService(currentAction.data)
      } else if (currentAction.type === 'processWorkflow') {
        const processWorkflow = await databaseService.workflows.getWorkflow(currentAction.id);
        if (!processWorkflow) throw new Error(`Not found processWorkflow id: ${currentAction.id}`);
        
        service = new WorkflowRunnerService(processWorkflow, this.device, this.runner, this.datasets);
        serviceResult = await service.execute();
      } else {
        service = new ActionRunnerService(currentAction, this.device, this.variableValueMap);
        serviceResult = await service.execute();
      }
      
      const { success, result, error } = serviceResult;
      if (success) {
        const nextActionId = currentActionNode.data.successNode;
        console.log("Action executed successfully", result);
        console.log("To successNode with nextActionId: ", nextActionId)
        return this.runAllActions(nextActionId);
      } else {
        if (error) throw error;
        
        const nextActionId = currentActionNode.data.failedNode;
        console.error("Action executed failed", result);
        console.log("To failedNode with nextActionId: ", nextActionId)
        return this.runAllActions(nextActionId);
      }
    } catch (error) {
      console.error("Unexpected error in runAllActions", error);
      return { success: false, error: error };
    }
  }

  processDataService(actionData: any) {
    try {
      actionData.forEach((currActionData: any) => {
        if (currActionData.type === 'dataset') {
          // Modify this.datasetIdMap to the next id
          const matchRunnerData = this.runnerData.find(runnerData => runnerData.variable === currActionData.variable);
          if (!matchRunnerData) throw new Error(`Not found variable to processData: ${currActionData.variable}`);

          let newValue;
          if (currActionData.value === 'next') {
            newValue = (parseInt(this.datasetIdMap[matchRunnerData.value]) + 1).toString();
          } else if (currActionData.value === 'previous') {
            newValue = (parseInt(this.datasetIdMap[matchRunnerData.value]) - 1).toString();
          } else {
            newValue = this.datasetIdMap[matchRunnerData.value];
          }
          this.datasetIdMap[matchRunnerData.value] = newValue;
          this.variableValueMap = this.envService.variableValueMap(this.runnerData, this.datasets, this.datasetIdMap);
        } else if (currActionData.type === 'static') {
          // Temporary change static value
          const matchRunnerData = this.runnerData.find(runnerData => runnerData.variable === currActionData.variable);
          if (!matchRunnerData) throw new Error(`Not found variable to processData: ${currActionData.variable}`);

          this.runnerData = this.runnerData.map(runnerData => {
            if (runnerData.variable === currActionData.variable) {
              return { ...runnerData, value: currActionData.value };
            }
            return runnerData;
          });
          this.variableValueMap = this.envService.variableValueMap(this.runnerData, this.datasets, this.datasetIdMap);
        }
      })

      return { success: true, result: "Success processData node!!!" }
    } catch (error){
      console.error("Unexpected error when processData: ", error)
      return { success: false, error: error }
    }
  }
}
