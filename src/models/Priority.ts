import { Entity, type RawEntity } from "./base/Entity";

export type PriorityName = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface RawPriority extends RawEntity {
  name: PriorityName;
  color: string;
  displayOrder: number;
}

export class Priority extends Entity<RawPriority> {
  readonly name: PriorityName;
  readonly color: string;
  readonly displayOrder: number;

  constructor(raw: RawPriority) {
    super(raw);
    this.name = raw.name;
    this.color = raw.color;
    this.displayOrder = raw.displayOrder;
  }

  static fromRaw(raw: RawPriority): Priority {
    return new Priority(raw);
  }
}
