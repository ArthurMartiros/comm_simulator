import { Request }   from "../models/message/request";
import { Contact }   from "../models/common/contact";
import { Util }      from "../models/common/utils";
import { Sequence }  from "../models/common/sequence";
import { Response }  from "../models/message/response";
import { Station }   from "../station";
import { Challenge } from "../models/common/challenge";
import { Event }     from "../models/common/event";

export class RegisterRequest extends Request {
  constructor(contact: Contact, expires = 3600) {
    super({
      method: "REGISTER",
      uri: contact.uri.server,
      from: contact,
      to: contact.clone('name,uri'),
      expires: expires,
      callId: Util.guid(),
      maxForwards: 70,
      supported: ['replaces', 'outbound'],
      //allow: ['INVITE', 'ACK', 'CANCEL', 'BYE', 'REFER', 'NOTIFY', 'MESSAGE', 'SUBSCRIBE', 'INFO', 'PUBLISH'],
      sequence: new Sequence({
        method: "REGISTER",
        value: 1
      }),
      contentLength: 0
    });
  }
}

export class SubscribeRequest extends Request {
  constructor(contact: Contact, address: Contact) {
    super({
      method: "SUBSCRIBE",
      uri: contact.uri,
      from: contact,
      to: contact.clone('name,uri'),
      contact: address,
      callId: Util.guid(),
      expires: 300,
      event: new Event({
        type: 'message-summary'
      }),
      sequence: new Sequence({
        method: "SUBSCRIBE",
        value: 1
      }),
      maxForwards: 70,
      contentLength: 0
    });
  }
}

export class RegisterDialog {

  private station: Station;
  private request: Request;
  private challenge: Challenge;

  private get address(): Contact {
    return this.station.address;
  }

  private get contact(): Contact {
    return this.station.contact;
  }

  constructor(station: Station) {
    this.station = station;
    this.onResponse = this.onResponse.bind(this);
    this.onRequest = this.onRequest.bind(this);
    this.station.on('request', this.onRequest);
  }

  signAuthorization(request: Request) {
    if (this.challenge) {
      request.authorization = this.challenge.authorize(request,
        this.station.contact.uri.username,
        this.station.contact.uri.password
      );
    }
  }

  signProxyAuthorization(request: Request, username, password) {
    if (this.challenge) {
      request.proxyAuthorization = this.challenge.authorize(request,
        username,
        password
      );
    }
  }

  register(expires, username?, password?) {
    return this.doRegister(expires, username, password);
  }

  doRegister(expires, username?, password?) {
    this.request = new RegisterRequest(this.contact, expires);
    return this.request.send(this.station.transport).catch(e => {
      if (e instanceof Response) {
        if (e.status == 407) {
          this.challenge = new Challenge(e.proxyAuthenticate);
          if (!this.request.proxyAuthorization) {
            this.signProxyAuthorization(this.request, username, password);
            this.request.sequence.value++;
            this.request.via = void 0;
            if (e.via.params.received) {
              //this.station.transport.via.host = e.via.params.received;
              this.request.contact.uri.host = e.via.params.received;
            }
            this.station.transport.send(this.request);
            return;
          } else {
            console.info(`Invalid credentials for ${this.station.contact}`);
          }
        }
      }
      throw e;
    })
  }

  doSubscribe() {
    return Promise.resolve(true);
    //return new SubscribeRequest(this.contact,this.address).send(this.station.transport);
  }

  sendNotifyOk(message: Request) {
    var response = new Response({
      status: 200,
      message: "OK",
      via: message.via,
      from: message.from,
      to: message.to,
      callId: message.callId,
      expires: 3600,
      sequence: message.sequence,
      contentLength: 0
    });
    this.station.transport.send(response);
  }

  onRequest(message: Request) {
    if (message.method == "NOTIFY") {
      this.sendNotifyOk(message)
    }
  }

  onResponse(message: Response) {
    if (message.callId == this.request.callId) {
      if (message.status == 401) {
        this.challenge = message.authenticate;
        if (!this.request.authorization) {
          this.signAuthorization(this.request);
          this.request.sequence.value++;
          this.station.transport.send(this.request);
        } else {
          console.info(`Invalid credentials for ${this.station.contact}`);
        }
      } else if (message.status == 200) {
        if (this.request.method == "REGISTER") {
          this.doSubscribe();
        } else if (this.request.method == "NOTIFY") {
          this.station.emit('register')
        }
      }
    }
  }

}