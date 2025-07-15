import { Routes } from "@angular/router";
import { DASHBOARD_ROUTES } from "./features/dashboard/dashboard.routes";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/landing/landing").then((m) => m.Landing),
  },
  DASHBOARD_ROUTES,
  {
    path: "**",
    loadComponent: () =>
      import("./features/not-found/not-found").then((m) => m.NotFound),
  },
];
