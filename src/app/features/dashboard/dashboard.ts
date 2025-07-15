import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Analytics } from "./analytics/analytics";
import { Candidates } from "./candidates/candidates";
import { Overview } from "./overview/overview";

const materialImports = [
  MatToolbarModule,
  MatTabsModule,
  MatIconModule,
  MatChipsModule,
];

const componentImports = [Candidates, Overview, Analytics];

@Component({
  selector: "app-dashboard",
  imports: [materialImports, componentImports],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
