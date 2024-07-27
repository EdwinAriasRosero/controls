import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EnvironmentProviders, importProvidersFrom, inject, Injectable, InjectionToken, Injector, makeEnvironmentProviders, OnDestroy, signal, TemplateRef } from "@angular/core";
import { SpinnerComponent, SpinnerInto } from "./spinner.component";

export const REPOSITORY_SPINNER_OPTIONS = new InjectionToken<SpinnerServiceOptions>('REPOSITORY_SPINNER_OPTIONS');

export interface SpinnerServiceOptions {
  color?: string;
}

export const provideEaSpinner = (options?: SpinnerServiceOptions): EnvironmentProviders => {

  const defaultOptions: SpinnerServiceOptions = {
    color: 'white'
  }

  return makeEnvironmentProviders([
    {
      provide: REPOSITORY_SPINNER_OPTIONS,
      useValue: { ...defaultOptions, ...options }
    },
    {
      provide: SpinnerService
    }
  ]);

};

@Injectable()
export class SpinnerService implements OnDestroy {
  public spinnerStatus = signal<SpinnerInto>({ status: false });
  public spinnerStatusObs$ = this.spinnerStatus;
  private dialogComponentRef?: ComponentRef<SpinnerComponent>;
  private options = inject(REPOSITORY_SPINNER_OPTIONS);

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector) {

    setTimeout(() => this.initComponentUI(), 0);
  }

  private initComponentUI() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent);

    this.dialogComponentRef = componentFactory.create(this.injector);
    this.dialogComponentRef.instance.color.set(this.options.color!);

    this.appRef.attachView(this.dialogComponentRef.hostView);
    const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  ngOnDestroy(): void {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
    }
  }

  show(message?: string): void {
    this.spinnerStatus.set({ status: true, message });
  }

  hide(): void {
    this.spinnerStatus.set({ status: false });
  }

  registerCustom(spinner: TemplateRef<any>) {
    if (this.dialogComponentRef) {
      this.dialogComponentRef.instance.template = spinner;
    }
  }

  unregisterCustom() {
    if (this.dialogComponentRef) {
      this.dialogComponentRef.instance.template = undefined;
    }
  }

}
