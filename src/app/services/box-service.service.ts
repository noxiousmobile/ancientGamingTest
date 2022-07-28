import {
  Injectable
} from '@angular/core';
import {
  Apollo,
  gql
} from 'apollo-angular';
import {
  CookieService
} from 'ngx-cookie-service';
import {
  BehaviorSubject
} from 'rxjs';
import {
  UserDTO
} from '../models/user.model';

import {
  skipWhile,
  take
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BoxServiceService {

  public currentUser = new BehaviorSubject(null);
  public isLoggedIn: boolean = false;

  public amount: number = 0;
  public userName: string = '';

  constructor(
    private apollo: Apollo,
    private cookieService: CookieService
  ) {}

  getCurrentUser() {

    this.setCookie();

    this.apollo
      .watchQuery({
        query: gql `
        query {
          currentUser {
            id
            name
            wallets {
              id
              amount
              currency
            }
          }
        }
        `,
      })
      .valueChanges.subscribe((data: any) => {
        if (data.data.currentUser.id) {
          this.currentUser.next(data.data.currentUser);
          this.isLoggedIn = true;
          this.updateUserData();
        }
      });
  }

  checkUserStatus() {
    this.currentUser.getValue() ? this.isLoggedIn = true : this.isLoggedIn = false;
  }

  setCookie() {
    // My cookie
    this.cookieService.set('session', 's:gNFAjQrm9aMDN8H3PknRjB2z_gi-sb2y.MLQkPrRo8ktB3uSphSfvGIsiuVYGUZxSCW22ZFjXFF4', {
      expires: 2000,
      sameSite: 'None',
      secure: true
    });
  }

  updateUserData() {
    this.currentUser.pipe(
        skipWhile(v => !v),
        take(1))
      .subscribe((value: UserDTO) => {
        this.userName = value.name;
        this.adjustUserWallet(value);
      });
  }

  adjustUserWallet(value: UserDTO) {
    this.amount = 0;
    // Sum wallet amount
    if (value.wallets) {
      value.wallets.forEach(element => {
        this.amount += element.amount;
      });
    }
  }

}
