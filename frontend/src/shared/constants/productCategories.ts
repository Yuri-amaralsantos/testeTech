export type ProductCategory =
  | "all"
  | "notebooks"
  | "audio"
  | "perifericos"
  | "monitores";

export const productCategoryLabels: Record<ProductCategory, string> = {
  all: "Todos",
  notebooks: "Notebooks",
  audio: "Áudio",
  perifericos: "Periféricos",
  monitores: "Monitores",
};

export const productCategoryOrder: ProductCategory[] = [
  "all",
  "notebooks",
  "audio",
  "perifericos",
  "monitores",
];
