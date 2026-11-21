import type { Category } from "@/models/Category";
import { CategoryItem } from "./CategoryItem";

interface Props {
  categories: Category[];
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: Props) {
  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryItem
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
