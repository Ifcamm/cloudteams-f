import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-side-nave',
  templateUrl: './side-nave.component.html',
  styleUrls: ['./side-nave.component.css'],
})
export class SideNaveComponent implements OnInit {
  showFiller = false;
  panelOpenState = false;
  isLogin = false;
  userRole = '';
  userId = '';
  userName = '';
  private authListenerSub!: Subscription;

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
}
