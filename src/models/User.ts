import { Entity, type RawEntity } from "./base/Entity";

export interface RawUser extends RawEntity {
  email: string;
  name: string;
}

export class User extends Entity<RawUser> {
  readonly email: string;
  readonly name: string;

  constructor(raw: RawUser) {
    super(raw);
    this.email = raw.email;
    this.name = raw.name;
  }

  get initials(): string {
    return this.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  static fromRaw(raw: RawUser): User {
    return new User(raw);
  }
}
