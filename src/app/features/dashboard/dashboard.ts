import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";

const materialImports = [
  MatToolbarModule,
  MatTabsModule,
  MatIconModule,
  MatChipsModule,
];

const componentImports = []; 

@Component({
  selector: "app-dashboard",
  imports: [materialImports],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
