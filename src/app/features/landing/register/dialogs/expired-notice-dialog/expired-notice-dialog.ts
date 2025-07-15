import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expired-notice-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './expired-notice-dialog.html',
  styleUrl: './expired-notice-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpiredNoticeDialog {

}
