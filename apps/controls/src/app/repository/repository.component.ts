import { JsonPipe } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { userAdapter } from "../app.config";


export interface UserEntity {
    userId: string;
    name: string;
    description: string;
    status: string;
}


@Component({
    selector: 'app-repository',
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
export class RepositoryComponentWrap implements OnInit {

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
        let maxId = 1 + Math.max(...this.data().map(d => Number(d.userId)));

        this.store.dispatch(userAdapter.addOne({
            userId: maxId.toString(),
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
            console.error('data ERROR')
        }));
    }

    delete() {
        this.store.dispatch(userAdapter.removeOne(this.data()[0]));
    }
}