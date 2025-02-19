import { computed, Directive, inject, input } from "@angular/core";
import { MatFooterRowDef, MatHeaderRowDef } from "@angular/material/table";

@Directive({
    selector: 'tr[matExtraHeaderRow], tr[matExtraRow]',
    standalone: true
})
export class MatExtraHeaderRowDirective {
    public matHeaderRowDef = inject(MatHeaderRowDef, { optional: true });
    public matFooterRowDef = inject(MatFooterRowDef, { optional: true });
    public selector = computed(() => this.selectorHeader() || this.selectorFooter());
    public selectorHeader = input<string>('', { alias: 'matExtraHeaderRow' });
    public selectorFooter = input<string>('', { alias: 'matExtraRow' });
}