import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {}
  public userDetail: Object;

  ngOnInit(): void {

  }

  authenticate() {
    this.authService.signIn();
  }

  isSignedIn(){
    if (this.authService.isLoggedIn) {
      this.userDetail = this.authService.userDetail;
    }

    return this.authService.isLoggedIn;
  }

  getToken(){
    this.authService.getToken().then((token) => {
      console.log(token);
    });
  }

  signOut(){
    this.authService.signOut();
    this.userDetail = {};
    // this.router.navigate(['/']);
    location.reload();
  }
}
