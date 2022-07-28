import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  Apollo,
  gql
} from 'apollo-angular';
import {
  filter,
  map,
  distinctUntilChanged
} from 'rxjs/operators';
import {
  BoxServiceService
} from '../services/box-service.service';
import {
  BoxDialogComponent
} from '../box-dialog/box-dialog.component';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  MatSnackBar
} from "@angular/material/snack-bar";
import {
  NgxSpinnerService
} from "ngx-spinner";

// gql model actions
import { OPEN_BOX, BOX_SUBSRIPTION } from '../models/gql.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-box-page',
  templateUrl: './box-page.component.html',
  styleUrls: ['./box-page.component.scss']
})
export class BoxPageComponent implements OnInit {
  public boxes: any[] = [];
  public pageLoading = true;
  public error: any;

  constructor(
    private apollo: Apollo,
    private changeDetection: ChangeDetectorRef,
    public boxService: BoxServiceService,
    protected _dialog: MatDialog,
    protected _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.boxService.checkUserStatus();
    this.getData();
  }

  getData() {
    this.apollo
      .watchQuery({
        query: gql `
        query {
        boxes(free: false, purchasable: true, openable: true) {
          edges {
            node {
              id
              name
              iconUrl
              cost
            }
          }
        }
      }
        `,
      })
      .valueChanges.pipe(
        filter(v => !!v),
        distinctUntilChanged(),
        map((res: any) => {
          this.initBoxElements(res.data.boxes.edges);
        })
      )
      .subscribe();
    this.changeDetection.detectChanges();
  }

  initBoxElements(res: any) {
    this.boxes = res;
    this.pageLoading = false;
    this.changeDetection.detectChanges();
  }

  openBox(OpenBoxInput: any) {
    if (!this.boxService.isLoggedIn) {
      this._snackBar.open('Please authenticate to open a box!', '', {
        duration: 2000
      });
    } else {
      this.spinner.show();
      const OpenBoxInputObject = {
        boxId: OpenBoxInput.id,
        amount: parseInt(OpenBoxInput.cost, 10),
        multiplierBoxBet: 1
      }
      this.apollo.mutate({
        mutation: OPEN_BOX,
        variables: {
          input: OpenBoxInputObject
        }
      }).subscribe(({
        data
      }) => {
        console.log('Box oppened!', data);
        this.useSubscription();
        this._dialog.open(BoxDialogComponent, {
          height: '300px',
          width: '600px',
        });
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        console.log('Error subscribing: ', error);
        this._snackBar.open('Not enough ballance', 'Try another box', {
          duration: 2000
        });
      });
      this.changeDetection.detectChanges();
    }

  }

  authenticateUser() {
    this.boxService.getCurrentUser();
    this.changeDetection.detectChanges();
  }

  useSubscription() {
    this.apollo.subscribe({
      query: BOX_SUBSRIPTION,
      variables: {
        wallet: this.boxService.amount
      }
    }).subscribe((result) => {
      this.boxService.updateUserData();
      console.log('result', result)
    })
  }

}
