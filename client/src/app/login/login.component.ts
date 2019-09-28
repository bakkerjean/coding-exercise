import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CoreService } from "../socket.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  private error: string;

  constructor(private coreService: CoreService, private router: Router) {}

  ngOnInit() {}

  login(e, username, password) {
    e.preventDefault();
    
    this.error = "";

    const creds = {
      username: username,
      password: password
    };

    const ob = this.coreService.login(creds);
    ob.pipe(take(1)).subscribe({
      complete: () => {
        this.router.navigate(["todolists"]);
      },
      error: err => {
        this.error = err;
      }
    });
  }
}
