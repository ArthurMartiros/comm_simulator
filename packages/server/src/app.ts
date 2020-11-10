import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container }                         from 'typedi';
import { EnvConfigService }                  from './services/config.service';
import { ApiController }                     from "./controllers/api.controller";
import * as express                          from "express";
import { ActuatorController }                from './controllers/actuator.controller';

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection', reason, promise)
});

const configs = new EnvConfigService();

useContainer(Container);

const app: express.Application = createExpressServer({
  controllers: [ApiController, ActuatorController],
});

app.use(express.static('../client/build'));

/*MediaServer.instance.listen();

Agent.start([
  ["lgevorgyan", "Password123456"],
]).forEach((a: Agent) => {
  a.register(600, a.username, a.password);
});*/

// run express application on port 3000
app.listen(configs.port, () => {
  console.log(`Listening on port ${configs.port}`);
});