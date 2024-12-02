export interface Category {
  id: string;
  name: string;
  attachment: string;
  link: string;
}

export interface CategoryFilter {
  id: string;
  name: string;
  attachment: string;
  subCategories: CategoryFilter[];
}