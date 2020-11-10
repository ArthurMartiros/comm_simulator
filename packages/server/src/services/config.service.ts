import { IEnvConfigs } from "../interfaces/other/env_configs.interface";
import { Service }     from "typedi";
import { Expose }      from "class-transformer";
import { IEnv }        from "../interfaces/other/env.interface";
import { defaultEnv }  from '../configs/defaults/env.config';

@Service()
export class EnvConfigService implements IEnvConfigs {
  @Expose()
  public host: string;
  @Expose()
  public port: number;
  @Expose()
  public env: string;
  @Expose()
  public isAuthEnabled: boolean;
  @Expose()
  public protocol: string;

  constructor() {
    const env: IEnv = process.env as any;
    this.host = env.HOST || defaultEnv.HOST;
    this.port = parseInt((env.PORT || defaultEnv.PORT), 10);
    this.env = env.NODE_ENV;
    this.protocol = env.PROTOCOL || defaultEnv.PROTOCOL;
    this.isAuthEnabled = Boolean(env.IS_AUTH_ENABLED || defaultEnv.IS_AUTH_ENABLED);
  }
}