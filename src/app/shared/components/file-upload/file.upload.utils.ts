import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Read file as Data URL (for image preview)
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject("fileReadError");
    reader.readAsDataURL(file);
  });
}

export function imageFileValidator(allowedTypes?: string[], maxSize?: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (!file || !(file instanceof File)) return null;

    return validateImageFile(file, allowedTypes, maxSize);
  };
}

// Generate error message from control errors
export function getFileUploadErrorMessage(
  errors: ValidationErrors | null,
  maxSize: number
): string {
  if (!errors) return "";
  if (errors["required"]) return "Profile image is required";
  if (errors["invalidFileType"])
    return "Please upload a valid image file (PNG, JPG, JPEG)";
  if (errors["fileTooLarge"])
    return `File size must be less than ${formatFileSize(maxSize)}`;
  if (errors["fileReadError"]) return "Error reading file. Please try again.";
  return "Invalid file.";
}

export function validateImageFile(
  file: File,
  allowedTypes: string[] = ["image/png", "image/jpeg", "image/jpg"],
  maxSize: number = 5 * 1024 * 1024
): ValidationErrors | null {
  if (!allowedTypes.includes(file.type)) {
    return { invalidFileType: true };
  }

  if (file.size > maxSize) {
    return { fileTooLarge: true };
  }

  return null;
}

// TODO = ref with ng destroy function
export function mapFileToDataUrl(): (
  source$: Observable<File | null>
) => Observable<string | null> {
  return (source$) =>
    new Observable<string | null>((observer) => {
      const subscription = source$.subscribe({
        next: (file) => {
          if (!file) {
            observer.next(null);
            return;
          }

          const reader = new FileReader();

          reader.onload = () => observer.next(reader.result as string);
          reader.onerror = () => observer.error(new Error("FILE_READ_ERROR"));

          reader.readAsDataURL(file);
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });

      return () => subscription.unsubscribe();
    });
}



export function isFile(value: File | string | null): value is File {
  return value instanceof File;
}
