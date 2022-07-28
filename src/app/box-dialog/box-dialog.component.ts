import {
  Component,
  OnInit
} from '@angular/core';
declare var window: any;

@Component({
  selector: 'app-box-dialog',
  templateUrl: './box-dialog.component.html',
  styleUrls: ['./box-dialog.component.scss']
})
export class BoxDialogComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    this.animateConfetti();
  }

  animateConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.6
        }
      });
    }
  }

}
