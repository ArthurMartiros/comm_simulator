import { Contact }              from "../../models/common/contact";
import { Call }                 from "./call";
import { Station }              from "../../station";
import { InviteDialog }         from "./dialog";
import { Request }              from "../../models/message/request";
import { IncomingInviteDialog } from "./incoming";
import { OutgoingInviteDialog } from "./outgoing";
import { Util }                 from "../../models/common/utils";
import { MediaServer }          from "../../media/server";
import { Sdp }                  from "../../models/common/sdp";

function sendBindingRequest() {
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return `${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}`;
  }

  const random: string = guid();

  let buffer = Buffer.from('000100002112a442', 'hex');
  buffer[1] = 0x01;
  buffer[4] = 0x21;
  buffer[5] = 0x12;
  buffer[6] = 0xa4;
  buffer[7] = 0x42;

  const trId = random.substr(0, 12);
  console.info(trId);
  buffer =  Buffer.concat([buffer, Buffer.from(trId, 'hex')]);
  console.info('BINDING', buffer);
  return buffer;
}

export class InviteManager {

  public call: Call;
  public dialog: InviteDialog;
  public station: Station;


  constructor(station: Station) {
    this.station = station;
    this.onRequest = this.onRequest.bind(this);
    this.station.on('request', this.onRequest);
  }

  onRequest(message: Request) {
    if (!this.dialog && message.method == "INVITE") {
      const dialog = <IncomingInviteDialog>this.createDialog(message, IncomingInviteDialog);
      dialog.on('accept', (call) => {
        const sdp = new Sdp(message.content);
        MediaServer.instance.send(sendBindingRequest(), sdp.audio.port, sdp.connection.connectionAddress);
        MediaServer.instance.send(sendBindingRequest(), sdp.audio.port, sdp.connection.connectionAddress);
        setTimeout(() => {
          MediaServer.talkTo(call, sdp);
        }, 1000);
        setTimeout(() => {
          call.remoteSdp = null
        }, 5000);
      })
    }
  }

  sendInvite(to: Contact) {
    if (!this.dialog) {
      this.createDialog(new Request({
        callId: Util.guid(),
        from: this.station.contact,
        to: to
      }), OutgoingInviteDialog)
    }
  }

  protected createDialog(request: Request, type: {
    new(station: Station, request: Request): InviteDialog
  }) {
    this.dialog = new type(this.station, request);
    this.dialog.once('done', () => {
      this.dialog = null
    });
    return this.dialog;
  }
}