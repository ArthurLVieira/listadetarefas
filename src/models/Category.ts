import { Entity, type RawEntity } from "./base/Entity";

export interface RawCategory extends RawEntity {
  name: string;
  description?: string;
  color: string | null;
}

export class Category extends Entity<RawCategory> {
  readonly name: string;
  readonly description?: string;
  readonly color: string | null;

  protected constructor(raw: RawCategory) {
    super(raw);
    this.name = raw.name;
    this.description = raw.description;
    this.color = raw.color;
  }

  public static fromRaw(raw: RawCategory): Category {
    return new Category(raw);
  }
}
