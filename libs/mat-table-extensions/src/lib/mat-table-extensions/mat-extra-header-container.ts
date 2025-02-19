import { booleanAttribute, ChangeDetectorRef, ComponentFactoryResolver, computed, contentChildren, Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { MatColumnDef, MatFooterCellDef, MatHeaderCellDef } from '@angular/material/table';
import { MatExtraHeaderRowDirective } from './mat-extra-header-row.directive';
import { MatExtraHeaderTableDirective } from './mat-extra-header-table.directive';
import { MatExtraHeaderDefDirective } from './mat-extra-header-def.directive';
import { DynamicTemplateComponent } from './dynamic-template.component';

const createExtraColumn = (name: string,
    template: TemplateRef<any>,
    isHeader = true,
    sticky = false,
    stickyEnd = false): MatColumnDef => {

    let matColumnDef = new MatColumnDef();
    matColumnDef.name = name;

    if (isHeader) {
        let matHeaderDef = new MatHeaderCellDef(template)
        matColumnDef.headerCell = matHeaderDef;

    } else {
        let matFooterDef = new MatFooterCellDef(template)
        matColumnDef.footerCell = matFooterDef;
    }

    matColumnDef.sticky = sticky;
    matColumnDef.stickyEnd = stickyEnd;

    return matColumnDef;
}

@Directive({
    selector: 'ng-container[matExtraContainer]',
    standalone: true
})
export class MatExtraHeaderContainerDirective<T> {

    private vcRef = inject(ViewContainerRef);
    private resolver = inject(ComponentFactoryResolver);
    private cdr = inject(ChangeDetectorRef);
    private extraHeaderTable = inject<MatExtraHeaderTableDirective<T>>(MatExtraHeaderTableDirective);

    public autogenerateColumns = input(false, { transform: booleanAttribute });
    public setExtraHeaderRowRef = contentChildren<MatExtraHeaderRowDirective>(MatExtraHeaderRowDirective);
    public columnsDataSource = input.required<string[]>({ alias: 'matExtraContainer' });
    public extraHeaderRow = computed(() => this.setExtraHeaderRowRef().filter(x => !!x.matHeaderRowDef) || []);
    public extraFooterRow = computed(() => this.setExtraHeaderRowRef().filter(x => !!x.matFooterRowDef) || []);

    private cache: Array<MatColumnDef> = [];

    private emptyRow(content: 'th' | 'td') {
        const factory = this.resolver.resolveComponentFactory(DynamicTemplateComponent);
        const componentRef = this.vcRef.createComponent(factory);
        componentRef.instance.content.set(content);
        return componentRef.instance.templateRef();
    }

    constructor() {
        effect(() => {
            this.cache.forEach(cache => this.extraHeaderTable.table.removeColumnDef(cache));
            this.cache = [];

            //EXTRA HEADERS
            this.createExtraRow(this.extraHeaderRow(), true, this.columnsDataSource(), (def, columns) => {
                if (def.matHeaderRowDef)
                    def.matHeaderRowDef.columns = columns
            });

            //EXTRA FOOTERS
            this.createExtraRow(this.extraFooterRow(), false, this.columnsDataSource(), (def, columns) => {
                if (def.matFooterRowDef)
                    def.matFooterRowDef.columns = columns
            });

            this.cdr.markForCheck();
        }, { allowSignalWrites: true })
    }

    private createExtraRow(extra: MatExtraHeaderRowDirective[],
        isHeader: boolean,
        dataSource: string[],
        callback: (extraRow: MatExtraHeaderRowDirective, columns: string[]) => void) {

        extra.forEach(matExtraRow => {

            const columsInGroup = this.extraHeaderTable.extraHeaders()
                .filter(extraRow => extraRow.selector() === matExtraRow.selector());

            let dynamicColumns = dataSource;

            if (this.autogenerateColumns()) {

                (new Set(dataSource)).forEach(column => {
                    let extraColumn = columsInGroup.find(extraRow => extraRow.matColumnDef.name === column);

                    extraColumn
                        ? this.createHtmlExtraColumn(matExtraRow, extraColumn, isHeader)
                        : this.createHtmlExtraEmptyColumn(matExtraRow, column, this.emptyRow(isHeader ? 'th' : 'td'), isHeader);
                });

            } else {
                columsInGroup.forEach(extraRow => this.createHtmlExtraColumn(matExtraRow, extraRow, isHeader));
                dynamicColumns = columsInGroup.map(column => column.matColumnDef.name);
            }

            const columns = dataSource
                .filter(column => dynamicColumns.includes(column))
                .map(column => `${matExtraRow.selector()}_${column}`);

            callback(matExtraRow, columns);
        });
    }

    public createHtmlExtraColumn(matExtraRow: MatExtraHeaderRowDirective,
        extraRow: MatExtraHeaderDefDirective<T>,
        isHeader: boolean) {

        const column = createExtraColumn(`${matExtraRow.selector()}_${extraRow.matColumnDef.name}`,
            extraRow.templateRef,
            isHeader,
            extraRow.matColumnDef.sticky,
            extraRow.matColumnDef.stickyEnd);

        this.extraHeaderTable.table.addColumnDef(column)
        this.cache.push(column);
    }

    public createHtmlExtraEmptyColumn(matExtraRow: MatExtraHeaderRowDirective,
        columnName: string,
        templateRef: TemplateRef<any>,
        isHeader: boolean) {

        const column = createExtraColumn(`${matExtraRow.selector()}_${columnName}`,
            templateRef,
            isHeader,
            false,
            false);

        this.extraHeaderTable.table.addColumnDef(column)
        this.cache.push(column);
    }
}