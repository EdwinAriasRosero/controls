import { JsonPipe } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { EntityAdapter } from "@ea-controls/repository";
import { Store } from "@ngrx/store";


export interface UserEntity {
    lastName: string;
    id: number;
}


export const userAdapter = new EntityAdapter<UserEntity>("user");


@Component({
    selector: 'app-repository',
    template: `
    <button (click)="add()">Add</button>
    <button (click)="delete()">delete First</button>

    @for (item of data(); track item) {
    <ul>
        <li> {{ item.lastName }} </li>
    </ul>
    }`,
    standalone: true,
    imports: [JsonPipe]
})
export class RepositoryComponentWrap implements OnInit {

    data = signal<UserEntity[]>([]);
    static id: number = 0;

    constructor(private store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(userAdapter.getAll());

        this.store.select(userAdapter.feature).subscribe(data => {
            this.data.set(data);
        })
    }

    add() {
        RepositoryComponentWrap.id++;
        this.store.dispatch(userAdapter.addOne({ data: { id: RepositoryComponentWrap.id, lastName: `Arias ${RepositoryComponentWrap.id}` } }))
    }

    delete() {
        this.store.dispatch(userAdapter.removeOne({ data: this.data()[0] }));
    }
}