import {
  Injectable,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { getItem } from "@shared/operators/local-storage";
import { of } from "rxjs";
import { isExpired } from "../utils/utils";
import { RegisterHttp } from "./register.http";

@Injectable()
export class RegisterStore {
  private readonly http = inject(RegisterHttp);

  private readonly existingUuid = signal(getItem<string>("registration-uuid"));

  readonly storeCandidate = toSignal(this.initCandidate());

  readonly candidate = linkedSignal(() => {
    const candidate = this.storeCandidate();

    if (!candidate) return null;

    return candidate;
  });

  readonly isUpdateFlow = computed(() => {
    const candidate = this.candidate();
    if (candidate === null) return false;

    return Object(candidate).hasOwnProperty("id");
  });

  readonly hasEditExpired = computed(() =>
    isExpired(this.candidate()?.expiresAt.toDate())
  );

  readonly isAllowEdit = computed(
    () => !this.hasEditExpired() && this.isUpdateFlow()
  );

  private initCandidate() {
    const id = this.existingUuid();
    if (id) {
      return this.http.getCandidate(id);
    } else {
      return of(null);
    }
  }
}
