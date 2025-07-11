import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  resource,
  signal,
  viewChild,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { merge } from "rxjs";
import { filter, map } from "rxjs/operators";
import { } from "../../../features/register/utils/form";
import {
  formatFileSize,
  getFileUploadErrorMessage,
  imageFileValidator,
  isFile,
  mapFileToDataUrl,
  readFileAsDataUrl,
} from "./file.upload.utils";

@Component({
  selector: "app-file-upload",
  imports: [MatIcon, MatIconButton, MatButtonModule],
  templateUrl: "./file-upload.html",
  styleUrl: "./file-upload.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUpload),
      multi: true,
    },
  ],
})
export class FileUpload implements ControlValueAccessor {
  readonly fileInput = viewChild("fileInput", {
    read: ElementRef,
  });
  readonly control = inject(FormBuilder).control<File | string | null>(null, {
    validators: [imageFileValidator()],
  });

  // Optional configuration inputs
  readonly label = input<string>("Upload Profile Image");
  readonly accept = input<string>("image/*");
  readonly maxSize = input<number>(5 * 1024 * 1024); // 5MB default
  readonly allowedTypes = input<string[]>([
    "image/png",
    "image/jpeg",
    "image/jpg",
  ]);

  readonly value = signal<File | string | null>(null);

  readonly disabled = signal(false);
  readonly selectedFile = computed(() => {
    const value = this.value();
    return value !== null;
  });

  readonly uploadHintText = computed(() => {
    const types = this.allowedTypes();
    const size = this.maxSize();
    const extensions = types
      .map((type) => {
        const parts = type.split("/");
        return parts[1]?.toUpperCase() || "";
      })
      .filter((ext) => ext);
    const sizeText = formatFileSize(size);
    return `${extensions.join(", ")} up to ${sizeText}`;
  });

  readonly fileResource = resource({
    params: () => this.value(),
    loader: async ({ params: file }) => {
      if (typeof file === "string") return Promise.resolve(file);
      if (!isFile(file)) return Promise.resolve(null);
      return readFileAsDataUrl(file);
    },
  });

  // CVA callbacks
  private onChange: (value: File | string | null) => void = () => {};
  private onTouched: () => void = () => {};

  private readonly errorTrigger$ = merge(
    this.control?.statusChanges,
    this.control?.valueChanges
  );

  readonly hasError = toSignal(
    this.errorTrigger$.pipe(map(() => this.control.invalid)),
    {
      initialValue:
        this.control.invalid && (this.control.touched || this.control.dirty),
    }
  );
  readonly errorMessage = toSignal(
    this.errorTrigger$.pipe(
      map(() => getFileUploadErrorMessage(this.control!.errors, this.maxSize()))
    ),
    {
      initialValue: getFileUploadErrorMessage(
        this.control.errors,
        this.maxSize()
      ),
    }
  );

  constructor() {
    effect(() => {
      this.control.setValue(this.value());
    });
  }

  // CVA methods
  writeValue(value: File | string | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: File | string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // UI event handlers
  onFileSelected(event: Event): void {
    if (this.disabled()) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
    this.onTouched();
  }

  onDragOver(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.processFile(files[0]);
    }
    this.onTouched();
  }

  private processFile(file: File): void {
    this.value.set(file);
    this.onChange(file);
  }
  removeFile(event: Event): void {
    if (this.disabled()) return;
    event.stopPropagation();

    const fileInput = this.fileInput();

    if (fileInput) {
      fileInput.nativeElement.value = ""; // Clear file for to enable change
    }

    this.value.set(null);
    this.onChange(null);
    this.onTouched();
  }
}
