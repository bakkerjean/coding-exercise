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

  constructor() {}

  isLoggedIn() {
    return this.loggedIn;
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
          console.log("Authenticated");
          loginObserver.complete();
          this.loggedIn = true;
        });
        this.socket.on("unauthorized", err => {
          console.log("Unauthorised: " + err);
          this.notify(loginObserver, "Incorrect user name or password");

          this.socket.disconnect();
        });
      });

      this.socket.on("error", err => {
        console.log("Socket error: " + err);
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
