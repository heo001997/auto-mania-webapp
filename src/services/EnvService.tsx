import { Dataset } from "@/types/Dataset";
import { RunnerData } from "@/types/Runner";

export class EnvService {
  datasetIdMap(runnerData: RunnerData[]): Record<string, string> {
    return runnerData.reduce((acc, item) => {
      if (item.type === 'dataset') {
        acc[item.value.toString()] = '0';
      }
      return acc;
    }, {} as Record<string, string>);
  }

  variableValueMap(runnerData: RunnerData[], datasets: Dataset[], datasetIdMap: Record<string, string>): Record<string, string> {
    const variableValueMap: Record<string, string> = {}

    runnerData.forEach((item: RunnerData, idx: number) => {
      const realValue = this.getRealValue(runnerData, idx, datasets, datasetIdMap);
      variableValueMap[item.variable] = realValue;
    });

    return variableValueMap;
  }

  parseVariables(strValue: string, variableValueMap: Record<string, string>): string {
    const variables = this.extractVariables(strValue);
    let isError = false;
    const variableValues = variables.reduce((acc, variable) => {
      if (variableValueMap[variable]) {
        return acc.replace(`$\{${variable}}`, variableValueMap[variable]);
      }
      isError = true;
      return acc;
    }, strValue);
    return isError ? '' : variableValues;
  }

  getRealValue(runnerData: any, idx: number, datasets: Dataset[], datasetIdMap: Record<string, string>): string {
    const currRunnerData = runnerData[idx];
    
    if (currRunnerData.type === "dataset" && currRunnerData.value !== "") {
      const datasetId = currRunnerData.value;

      const matchDataset = datasets.find((dataset) => dataset.id.toString() === datasetId)
      if (!matchDataset) return '';

      const matchingDatasetIndex = parseInt(datasetIdMap[datasetId]);
      if (isNaN(matchingDatasetIndex)) return '';

      const realValue = matchDataset.data[matchingDatasetIndex];

      if (typeof realValue === 'object') {
        return JSON.stringify(realValue || '');
      }
      return realValue || '';
    } else if (currRunnerData.type === "variable") {
      return this.getVariableRealValue(runnerData, currRunnerData.value, datasets, datasetIdMap);
    }
    return currRunnerData.value;
  }

  private extractVariables(str: string): string[] {
    // Function to extract variable names
    // Regular expression to match ${...}
    const regex = /\$\{([^}]+)\}/g;

    const variables = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      variables.push(match[1]);
    }
    return variables;
  }

  private getVariableRealValue(runnerData: any, variableValue: string, datasets: Dataset[], datasetIdMap: Record<string, string>): string {
    const [variableName, ...propertyPath] = variableValue.split('.');
    const matchingVariable = runnerData.find((data: any) => data.variable === variableName);
    
    if (matchingVariable) {
      let value = this.getValueForVariable(matchingVariable, datasets, datasetIdMap);
      if (!value) return '';
      
      value = this.traversePropertyPath(value, propertyPath);
      return typeof value === 'object' ? JSON.stringify(value) : value;
    }
    return '';
  }

  private getValueForVariable(variable: any, datasets: Dataset[], datasetIdMap: Record<string, string>): any {
    if (variable.type === "dataset" && variable.value !== "") {
      const dataset = datasets.find((dataset) => dataset.id.toString() === variable.value);
      if (dataset) {
        const matchingDatasetIndex = parseInt(datasetIdMap[variable.value]);
        if (!isNaN(matchingDatasetIndex) && matchingDatasetIndex < dataset.data.length) {
          return dataset.data[matchingDatasetIndex];
        }
      }
      return '';
    }
    return variable.value;
  }

  private traversePropertyPath(value: any, propertyPath: string[]): any {
    if (propertyPath.length > 0 && typeof value === 'object') {
      try {
        return propertyPath.reduce((obj, prop) => obj[prop], value) || '';
      } catch (error) {
        console.error('Error accessing nested property:', error);
        return '';
      }
    }
    return value;
  }
}
