import { Body, Controller, Get, Param, Post } from "routing-controllers";
import { Inject }                             from "typedi";
import { ApiService }                         from "../services/api.service";

@Controller('/api')
export class ApiController {
  @Inject()
  protected apiService: ApiService;

  @Get('/')
  getAll() {
    return this.apiService.getAll();
  }

  @Get('/tasks')
  getAllTasks() {
    return this.apiService.getAllTasks();
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.apiService.getOne(id);
  }

  @Get('/tasks/:id')
  getOneTask(@Param('id') id: number) {
    return this.apiService.getOneTask(id);
  }

  @Post('/task/:id')
  upsertTask(@Param('id') id: number, @Body() task: any) {
    return this.apiService.upsertTask(id, task);
  }

}