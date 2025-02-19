import { Component } from "@angular/core";
import { MatTableModule } from '@angular/material/table';
import { MatTableExtensionsComponent, MatExtraHeaderContainerDirective, MatExtraHeaderDefDirective, MatExtraHeaderRowDirective, MatExtraHeaderTableDirective } from '@ea-controls/mat-table-extensions';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MatTableModule, MatExtraHeaderContainerDirective, MatExtraHeaderDefDirective, MatExtraHeaderRowDirective, MatExtraHeaderTableDirective],
    template: `
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8" header-multiple>

        <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef> No. </th>
            <td mat-cell *matCellDef="let element"> {{element.position}} </td>

            <th *matExtraHeader="'search'" mat-header-cell>
                <input type="text">
            </th>
        </ng-container>

        <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>

            <th *matExtraHeader="'search'" mat-header-cell>
                <input type="text">
            </th>
        </ng-container>

        <ng-container matColumnDef="weight">
            <th mat-header-cell *matHeaderCellDef> Weight </th>
            <td mat-cell *matCellDef="let element"> {{element.weight}} </td>

            <th *matExtraHeader="'search'" mat-header-cell>
                <input type="text">
            </th>
        </ng-container>

        <ng-container matColumnDef="symbol">
            <th mat-header-cell *matHeaderCellDef> Symbol </th>
            <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>

            <th *matExtraHeader="'search'" mat-header-cell>
                <input type="text">
            </th>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>

        <ng-container [matExtraContainer]="displayedColumns">
            <tr mat-header-row *matHeaderRowDef="[]" matExtraHeaderRow="search"></tr>
        </ng-container>
        
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>`
})
export class MatTableExtensionsComponentWrap {

    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    dataSource = ELEMENT_DATA;

}

