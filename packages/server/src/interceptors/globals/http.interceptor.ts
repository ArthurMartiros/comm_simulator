import { Action, Interceptor, InterceptorInterface } from "routing-controllers";

@Interceptor()
export class HttpInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    return action.response.end(content);
  }
}