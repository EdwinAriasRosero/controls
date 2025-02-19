import { Component, model, viewChild, TemplateRef } from "@angular/core";

@Component({
    selector: 'em3-dynamic-template',
    standalone: true,
    template: `<ng-template #tpl>
        @switch (content()) {
            @case ('th') {
                <th class="mat-mdc-header-cell"></th>
            }
            @case ('td') {
                <td class="mat-mdc-footer-cell"></td>
            }
        }
    </ng-template>`,
})
export class DynamicTemplateComponent {
    public content = model.required<'th' | 'td'>();
    public templateRef = viewChild.required<TemplateRef<any>>('tpl');
}
