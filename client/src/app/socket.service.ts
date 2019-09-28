import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import * as io from "socket.io-client";

@Injectable({
  providedIn: "root"
})
export class CoreService {
  private url = "http://localhost:3000";
  private socket;

  private loggedIn = false;
  private remoteEvents = new Subject<any>();

  constructor() {}

  isLoggedIn() {
    return this.loggedIn;
  }

  getRemoteEvents(): Observable<any> {
    return this.remoteEvents.asObservable();
  }

  sendCommand(cmd) {
    this.socket.emit("cmd", cmd);
  }

  login(loginInfo) {
    this.loggedIn = false;
    const observable = new Observable(loginObserver => {
      this.socket = io(this.url, {
        reconnection: false
      });

      this.socket.on("connect", () => {
        console.log("connected");

        this.socket.emit("authentication", JSON.stringify(loginInfo));

        this.socket.on("authenticated", () => {
          console.log("authenticated");
          loginObserver.complete();
          this.loggedIn = true;
          this.socket.on("event", event => {
            this.remoteEvents.next(event);
          });
        });

        this.socket.on("unauthorized", err => {
          console.log("unauthorised: " + err);
          this.notify(loginObserver, "Incorrect user name or password");
          this.socket.disconnect();
        });
      });

      this.socket.on("error", err => {
        console.log("socket error: " + err);
        this.notify(loginObserver, err);
      });
    });

    return observable;
  }

  notify(loginObserver, msg) {
    if (!loginObserver.closed) {
      loginObserver.error(msg);
      loginObserver.closed = true;
    }
    this.loggedIn = false;
  }
}
