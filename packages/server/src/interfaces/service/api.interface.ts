export interface IApiService {
  getAll(): Promise<any>;

  getOne(id: number): Promise<any>;

  getAllTasks(): Promise<any>;

  getOneTask(id: number): Promise<any>;

  upsertTask(id: number, task: any): Promise<any>;
}