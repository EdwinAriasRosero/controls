import { Component } from "@angular/core";
import { LayoutComponent } from '@ea-controls/layout';

@Component({
    selector: 'app-layout',
    template: `<ea-layout mode="horizontal">

    <section ea-header style="background-color: yellow;">
        Header
    </section>

    <section ea-left-sidebar style="background-color: aqua;">
        Left
    </section>

    <section ea-right-sidebar style="background-color: bisque;">
        Right
    </section>

    <section ea-footer style="background-color: lightgreen;">
        Footer
    </section>

    My content

</ea-layout>`,
    standalone: true,
    imports: [LayoutComponent]
})
export class LayoutComponentWrap { }