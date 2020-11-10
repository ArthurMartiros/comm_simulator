import { Controller, Get } from 'routing-controllers';

@Controller('/actuator')
export class ActuatorController {
  @Get('/health')
  health() {
    return {};
  }
}