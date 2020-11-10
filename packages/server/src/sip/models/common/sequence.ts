import { Model } from "../model";

export class Sequence extends Model {
  public method: string;
  public value: number;

  toString(options?: any) {
    return `${this.value} ${this.method}`;
  }
}