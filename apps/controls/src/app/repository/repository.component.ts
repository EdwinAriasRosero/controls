import { JsonPipe } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { userAdapter } from "../app.config";


export interface UserEntity {
    id: string;
    name: string;
    description: string;
    status: string;
}


@Component({
    selector: 'app-repository',
    template: `
    <button (click)="add()">Add</button>
    <button (click)="delete()">delete First</button>

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
    static id: number = 0;

    constructor(private store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(userAdapter.getAll());

        //You can use async pipe in html to avoid this
        this.store.select(userAdapter.feature).subscribe(data => this.data.set(data))
        this.store.select(userAdapter.selectById("2")).subscribe(data => this.selected.set(data))
    }

    add() {
        RepositoryComponentWrap.id = this.data().length;
        this.store.dispatch(userAdapter.addOne({
            id: `${RepositoryComponentWrap.id}`,
            name: `Edwin`,
            description: "test",
            status: "active"
        }
        ))
    }

    delete() {
        this.store.dispatch(userAdapter.removeOne(this.data()[0]));
    }
}