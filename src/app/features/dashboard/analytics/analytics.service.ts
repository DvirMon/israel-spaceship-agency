import { computed, effect, inject, Injectable } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { FireStore } from "@core/services/fire-store.service";

type AnalyticsModel = {
  id: "visits" | "register";
  count: number;
};

@Injectable({
  providedIn: "root",
})
export class AnalyticsService extends FireStore<AnalyticsModel> {
  private readonly analyticsCollection = this.loadCollection("analytics");
  private readonly analyticsResource = rxResource({
    defaultValue: [],
    stream: () => this.analyticsCollection,
  });

  readonly isLoading = this.analyticsResource.isLoading;

  readonly analytics = this.analyticsResource.value.asReadonly();

  readonly visits = computed(() => {
    const doc = this.analytics().find((doc) => doc.id === "visits");
    return doc || { count: 0 };
  });

  readonly register = computed(() => {
    const doc = this.analytics().find((doc) => doc.id === "register");
    return doc || { count: 0 };
  });

  readonly visitsCount = computed(() => this.visits().count);
  readonly registerCount = computed(() => this.register().count);

  readonly conversionRate = computed(() => {
    const visits = this.visitsCount();
    const register = this.registerCount();
    return visits > 0 ? Number(((register / visits) * 100).toFixed(1)) : 0;
  });
}
