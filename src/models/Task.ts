import { Entity, type RawEntity } from "./base/Entity";
import type { Category } from "./Category";
import type { PriorityName } from "./Priority";

export interface TaskPriority {
  id: number;
  name: PriorityName;
  color: string;
}

export interface TaskCategory {
  id: number;
  name: string;
  color: string | null;
}

export interface RawTask extends RawEntity {
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  category: Category | null;
  position: number;

  overdue: boolean;
  dueToday: boolean;
  upcoming: boolean;
  noDueDate: boolean;

  createdAt: string;
  updatedAt: string;
}

export class Task extends Entity<RawTask> {
  readonly title: string;
  readonly description: string | null;
  readonly completed: boolean;
  readonly completedAt: string | null;
  readonly dueDate: string | null;
  readonly priority: TaskPriority;
  readonly category: Category | null;
  readonly position: number;

  readonly overdue: boolean;
  readonly dueToday: boolean;
  readonly upcoming: boolean;
  readonly noDueDate: boolean;

  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(raw: RawTask) {
    super(raw);
    this.title = raw.title;
    this.description = raw.description;
    this.completed = raw.completed;
    this.completedAt = raw.completedAt;
    this.dueDate = raw.dueDate;
    this.priority = raw.priority;
    this.category = raw.category;
    this.position = raw.position;
    this.overdue = raw.overdue;
    this.dueToday = raw.dueToday;
    this.upcoming = raw.upcoming;
    this.noDueDate = raw.noDueDate;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
  }

  static fromRaw(raw: RawTask): Task {
    return new Task(raw);
  }
}
