import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { CoreService } from "../socket.service";

@Component({
  selector: "app-todolists",
  templateUrl: "./todolists.component.html",
  styleUrls: ["./todolists.component.css"]
})
export class TodolistsComponent implements OnInit {
  private items = [{name: 'list1'}];

  constructor(private coreService: CoreService, private router: Router) {}

  ngOnInit() {}

}
