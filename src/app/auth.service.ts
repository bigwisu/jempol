import { Injectable } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi/lib/src';
import GoogleUser = gapi.auth2.GoogleUser

@Injectable()
export class AuthService {
  public static SESSION_STORAGE_KEY: string = 'token';
  private user: GoogleUser;
  public isLoggedIn: boolean = false;
  private authInstance: gapi.auth2.GoogleAuth;
  public userDetail: Object;

  constructor(private googleAuth: GoogleAuthService) {
    let getAuth = googleAuth.getAuth().toPromise();
    getAuth
      .then((auth) => {
        this.authInstance = auth;
        if (auth.isSignedIn.get()) {
          this.user = auth.currentUser.get();
          this.isLoggedIn = true;
          this.getUserDetail();
        }
      });
  }

  async getToken(): Promise<string> {
    let token: string = sessionStorage.getItem(AuthService.SESSION_STORAGE_KEY);
    if (!token) {
      await this.signIn();
    }

    return sessionStorage.getItem(AuthService.SESSION_STORAGE_KEY);
  }

  private getUserDetail(): void {
    if(this.authInstance.isSignedIn.get()) {
      let basicProfile = this.user.getBasicProfile();
      
      this.userDetail = {
        name: basicProfile.getName(),
        imageUrl: basicProfile.getImageUrl(),
        email: basicProfile.getEmail()
      }
    }
  }

  public signIn(): void {
    if(this.authInstance.isSignedIn.get()) {
      return;
    }

    this.authInstance.signIn()
      .then(res => {
        this.signInSuccessHandler(res)
      })
  }

  public signOut(): void {
    this.googleAuth.getAuth()
      .subscribe((auth) => {
        auth.signOut()
          .then(() => {
            this.signOutHandler();
          });
      });
  }

  private signOutHandler() {
    sessionStorage.removeItem(
      AuthService.SESSION_STORAGE_KEY
    );
  }

  private signInSuccessHandler(res: GoogleUser) {
    this.user = res;
    this.isLoggedIn = true;
    sessionStorage.setItem(
      AuthService.SESSION_STORAGE_KEY, res.getAuthResponse().id_token
    );
  }
}
