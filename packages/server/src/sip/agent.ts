import { Phone }        from "./models/phone";
import { TcpTransport } from "./transport/tcp";

export class Agent extends Phone {

  static audioInterval;

  static get proxy() {
    return 'ffn-test.sip.us1.twilio.com'
  }

  static get server() {
    return 'ffn-test.sip.us1.twilio.com'
  }

  static get transport() {
    return Object.defineProperty(this, 'transport', <any>{
      value: new TcpTransport(`sip:${Agent.proxy}`)
    }).transport;
  }

  static start(l: any[]): Agent[] {
    var list = l.map((o: any[]): Agent => {
      return new Agent(o[0], ...o.slice(1));
    });
    this.audioInterval = setInterval(() => {
      list.forEach(a => a.sendAudio());
    }, 160 * 2);
    return list;
  }

  public username: string;
  public password: string;

  constructor(username, ...options) {
    super(username, Agent.server, Agent.transport);
    this.username = username;
    this.password = options[0];
    this.contact.uri.setParam('transport', 'tcp');
  }
}

