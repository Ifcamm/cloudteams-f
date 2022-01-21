import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  panelOpenState = false;
  isLogin = false;
  userRole = '';
  private authListenerSub!: Subscription;
  userId = '';
  userName = '';

  constructor(
    public userService: UserService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLogin = this.userService.getIsAuthenticated();
    this.userId = this.userService.getUserId();
    this.userRole = this.userService.getUserRole();
    this.userName = this.userService.getUserName();

    this.authListenerSub = this.userService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLogin = authStatus;
        this.userId = this.userService.getUserId();
        this.userRole = this.userService.getUserRole();
        this.userName = this.userService.getUserName();
      });
  }
  onLogout() {
    this.userService.logout();
  }
}
