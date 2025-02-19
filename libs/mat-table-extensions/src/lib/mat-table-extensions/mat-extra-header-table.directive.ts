import { contentChildren, Directive, inject } from "@angular/core";
import { MatTable } from "@angular/material/table";
import { MatExtraHeaderDefDirective } from "./mat-extra-header-def.directive";

@Directive({
    selector: 'table[header-multiple]',
    standalone: true
})
export class MatExtraHeaderTableDirective<T> {
    public table = inject<MatTable<T>>(MatTable);
    public extraHeaders = contentChildren<MatExtraHeaderDefDirective<T>>(MatExtraHeaderDefDirective);
}