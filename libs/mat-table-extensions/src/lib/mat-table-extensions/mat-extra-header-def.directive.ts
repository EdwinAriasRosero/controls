import { computed, Directive, inject, input, TemplateRef } from "@angular/core";
import { MatColumnDef } from "@angular/material/table";

@Directive({
    selector: '[matExtraHeader],[matExtra]',
    standalone: true
})
export class MatExtraHeaderDefDirective<T> {
    public matColumnDef = inject(MatColumnDef);
    public templateRef = inject<TemplateRef<T>>(TemplateRef);
    public selector = computed(() => this.selectorHeader() || this.selectorExtra());
    public selectorHeader = input<string>('', { alias: 'matExtraHeader' });
    public selectorExtra = input<string>('', { alias: 'matExtra' });
}