import { Model } from "../model";

export class Version extends Model {
  static SIP_2_0: Version = new Version({
    major: 2,
    minor: 0
  });

  minor: number;
  major: number;

  toString() {
    return `SIP/${this.major}.${this.minor}`
  }
}