import { JsonPipe } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { provideRepositoryPouchDb } from "@ea-controls/ngrx-repository-pouchdb";

export interface UserEntity {
    userId: string;
    name: string;
    description: string;
    status: string;
}

export const userAdapterPouchDb = new EntityAdapter<UserEntity>("itemsP", { getId: input => input.userId });

export const provideRepositoryPouchDbConfig = provideRepositoryPouchDb({
    adapters: [userAdapterPouchDb],
    idField: 'userId'

});

const userAdapter = userAdapterPouchDb;
@Component({
    selector: 'app-repository-pouchdb',
    template: `
    <button (click)="add()">Add</button>
    <button (click)="delete()">delete First</button>
    <button (click)="update()">update First name</button>

    <div style="border: solid thin blue;">
        {{ selected() | json }}
    </div>

    <div style="border: solid thin red;">
    @for (item of data(); track item) {
    <ul>
        <li> {{ item | json }} </li>
    </ul>
    }
    </div>
    `,
    standalone: true,
    imports: [JsonPipe]
})
export class RepositoryPouchDbComponent implements OnInit {

    data = signal<UserEntity[]>([]);
    selected = signal<UserEntity | undefined>(undefined);

    constructor(private store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(userAdapter.getAll());

        //You can use async pipe in html to avoid this
        this.store.select(userAdapter.feature).subscribe(data => this.data.set(data))
        this.store.select(userAdapter.selectById("2")).subscribe(data => this.selected.set(data))
    }

    add() {
        let maxId = Math.max(...this.data().map(d => Number(d.userId)))
        let newId = 1 + (maxId === -Infinity ? 0 : maxId);

        this.store.dispatch(userAdapter.addOne({
            userId: newId.toString(),
            name: `Edwin`,
            description: "test",
            status: "active"
        }))
    }

    update() {
        let firstItem = this.data()[0];
        this.store.dispatch(userAdapter.patchOne({ ...firstItem, name: "modified name" }, (data) => {
            console.log('data updated', data)
        }, (error) => {
            console.error('data ERROR', error)
        }));
    }

    delete() {
        this.store.dispatch(userAdapter.removeOne(this.data()[0]));
    }
}