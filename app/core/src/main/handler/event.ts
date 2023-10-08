import type { EventItem, EventCallback } from "types";

export class EventStack {
  private evs: EventItem[];

  constructor() {
    this.evs = [];
  }

  public push(name: string, callback: EventCallback) {
    if (!name || !callback) return;
    this.evs.push({ event: name, callback });
  }

  public getEvents() {
    return this.evs;
  }

  public merge(events: EventStack) {
    this.evs.push(...events.getEvents());
  }

  public static mergeStacks(...stacks: EventStack[]) {
    const events = new EventStack();
    for (const ev of stacks) {
      events.merge(ev);
    }
    return events;
  }
}
