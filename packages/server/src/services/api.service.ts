import { Service }     from "typedi";
import { IApiService } from "../interfaces/service/api.interface";

@Service()
export class ApiService implements IApiService {
  constructor() {
  }

  public getAll = async () => {
    return 'alll';
  }
  public getOne = async (id: number) => {
    return `number ${id}`;
  }
  public getAllTasks = async () => {
    return 'all tasks';
  }
  public getOneTask = async (id: number) => {
    return `number task ${id}`;
  }
  public upsertTask = async (id: number, task: any) => {
    return `${id}${task}`;
  }
}
