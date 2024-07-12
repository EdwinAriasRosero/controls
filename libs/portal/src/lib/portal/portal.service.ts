import { DomPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PortalService {

  private eventList: Array<{ event: string; source: BehaviorSubject<any>; }> = [];

  updateContent(event: string, data: DomPortal<any>) {
    this.getEvent(event).source?.next(data);
  }

  clearContent(event: string) {
    this.getEvent(event).source?.next(null);
  }

  subscribe(event: string, callback: (portal: DomPortal<any>) => void) {
    return this.getEvent(event).source?.subscribe(callback);
  }

  private getEvent(event: string) {
    let currentEvent = this.eventList.find(e => e.event === event);

    if (!currentEvent) {
      currentEvent = { event, source: new BehaviorSubject<DomPortal<any> | null>(null) };
      this.eventList.push(currentEvent);
    }

    return currentEvent;
  }
}
