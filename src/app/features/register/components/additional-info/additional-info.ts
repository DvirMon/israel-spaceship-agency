import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AdditionalInfoForm } from "../../models/register.model";
import { FileUpload } from "../../../../shared/file-upload/file-upload";

const coreImports = [ReactiveFormsModule];

const importMaterial = [MatFormFieldModule, MatInputModule];

@Component({
  selector: "app-additional-info",
  imports: [coreImports, importMaterial, FileUpload],
  templateUrl: "./additional-info.html",
  styleUrl: "./additional-info.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalInfo {
  readonly form = input.required<AdditionalInfoForm>();
}
