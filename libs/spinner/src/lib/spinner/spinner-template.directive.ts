import { Directive, OnInit, OnDestroy, TemplateRef } from "@angular/core";
import { SpinnerService } from "./spinner.service";

@Directive({
  selector: '[ea-spinner-template]',
  standalone: true
})
export class SpinnerTemplateDirective implements OnInit, OnDestroy {

  constructor(private templateRef: TemplateRef<any>,
    public spinner: SpinnerService
  ) {
  }

  ngOnDestroy(): void {
    this.spinner.unregisterCustom();
  }

  ngOnInit(): void {
    this.spinner.registerCustom(this.templateRef);
  }
}
