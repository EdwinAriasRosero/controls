import { Injectable, signal } from "@angular/core";
import { SpinnerInto } from "./spinner.component";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public spinnerStatus = signal<SpinnerInto>({ status: false });
  public spinnerStatusObs$ = this.spinnerStatus;

  constructor() { }

  show(message?: string): void {
    this.spinnerStatus.set({ status: true, message });
  }

  hide(): void {
    this.spinnerStatus.set({ status: false });
  }
}
