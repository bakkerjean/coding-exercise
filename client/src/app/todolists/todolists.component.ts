import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CoreService } from "../socket.service";

@Component({
  selector: "app-todolists",
  templateUrl: "./todolists.component.html",
  styleUrls: ["./todolists.component.css"]
})
export class TodolistsComponent implements OnInit {
  private items = [];
  private selectedItem: any;
  private listName = "";

  constructor(private coreService: CoreService, private router: Router) {}

  ngOnInit() {
    this.checkLoggedIn(() => {
      this.coreService.getRemoteEvents().subscribe({
        next: evt => this.handleRemoteEvent(evt)
      });
      this.coreService.sendCommand({ type: "snap" });
    });
  }

  checkLoggedIn(getEvents) {
    if (!this.coreService.isLoggedIn()) {
      this.router.navigate(["login"]);
    } else {
      getEvents();
    }
  }

  handleRemoteEvent(e) {
    switch (e.type) {
      case "itemadded":
        this.items.push(e.data);
        break;
      case "itemdeleted":
        const index = this.items.findIndex(i => i.name === e.data);
        this.items.splice(index, 1);
        break;
    }
  }

  show(item) {
    this.selectedItem = item;
  }

  delete(item) {
    this.checkLoggedIn(() => {
      this.coreService.sendCommand({
        type: "delitem",
        data: { name: item.name }
      });
    });
  }

  add(e, name) {
    e.preventDefault();
    if (name.length) {
      this.checkLoggedIn(() => {
        this.coreService.sendCommand({
          type: "additem",
          data: { name }
        });
      });
      this.listName = "";
    }
  }

  edit(e, name) {
    e.preventDefault();
    this.checkLoggedIn(() => {
      this.coreService.sendCommand({
        type: "updateitem",
        data: { name }
      });
    });
  }
}
