export interface RawEntity {
  id: number;
}

export abstract class Entity<T extends RawEntity> {
  readonly id: number;

  protected constructor(raw: T) {
    this.id = raw.id;
  }

  public get getId(): number {
    return this.id;
  }

  equals(entity: Entity<T>): boolean {
    return this.id === entity.id;
  }
}
