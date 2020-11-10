import { Model } from "../model";

export class Event extends Model {
  public type: string;
  public params: any;

  toString(options?: any) {
    return `${this.type} ${this.params ? Object.keys(this.params).map(
      k => `;${k}=${this.params[k]}`
    ).join('') : ''}`;
  }
}