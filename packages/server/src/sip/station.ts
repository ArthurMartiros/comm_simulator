import { Emitter }        from "./events";
import { Transport }      from "./transport";
import { Contact }        from "./models";
import { RegisterDialog } from "./dialogs/registration";
import { Request }        from "./models/message/request";
import { Util }           from "./models/common/utils";
import { InviteManager }  from "./dialogs/invitation";

export enum State {
  REGISTERING,
  UNREGISTERING,
  OFFLINE,
  ONLINE,
  DIALING,
  TALKING,
  RINGING
}

export class Station extends Emitter {

  public state: State;
  public transport: Transport;
  public contact: Contact;
  public address: Contact;

  public registration: RegisterDialog;
  public calls: InviteManager;

  public connected() {
    return this.transport.connected
  }

  public get isOffline(): boolean {
    return this.state == State.OFFLINE;
  }

  public get isRegistered(): boolean {
    return !(this.state == State.OFFLINE || this.state == State.REGISTERING);
  }

  public get name() {
    return this.contact.displayName;
  }

  constructor(contact: Contact | string, transport?: Transport) {
    super();
    this.state = State.OFFLINE;
    this.onConnect = this.onConnect.bind(this);
    this.onRequest = this.onRequest.bind(this);
    this.onResponse = this.onResponse.bind(this);
    this.setContact(contact);
    this.setTransport(transport);
  }

  public setContact(contact: Contact | string): Station {
    if (contact instanceof Contact) {
      this.contact = contact;
    } else {
      this.contact = new Contact(contact);
    }
    this.contact.tag = Util.hash(8);
    return this;
  }

  public setTransport(transport: Transport): Station {
    if (!this.transport) {
      this.transport = <Transport>transport;
      this.registration = new RegisterDialog(this);
      this.calls = new InviteManager(this);
      this.transport.on(Transport.CONNECT, this.onConnect);
      this.transport.on('request', this.onRequest);
      this.transport.on('response', this.onResponse);
    }
    return this;
  }

  public register(expires = 0, username?, password?) {
    if (expires > 0) {
      this.state = State.REGISTERING;
      return this.registration.register(expires, username, password).then(r => {
        this.state = this.state = State.ONLINE;
        this.emit('register');
      });
    } else {
      this.state = State.UNREGISTERING;
      return this.registration.register(expires, username, password).then(r => {
        this.state = this.state = State.OFFLINE;
        this.emit('unregister');
      });
    }
  }

  public toString(options?: any) {
    return `Station(${this.contact.toString(options)})`;
  }

  private onConnect() {
    this.address = new Contact(this.contact.toString());
    this.address.uri.host = this.transport.localAddress;
    this.address.uri.port = this.transport.localPort;
    this.emit('connect');
  }

  private onRequest(request: Request) {
    if (request.uri.username == this.contact.uri.username) {
      this.emit('request', request);
    }
  }

  private onResponse(response: Request) {
    this.emit('response', response);
  }


}