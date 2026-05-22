import { Product } from "../entities/Product.js";

const productsSeed: Array<
  Pick<Product, "name" | "category" | "description" | "price" | "imageUrl">
> = [
  {
    name: "Notebook Pro 14",
    category: "notebooks",
    description:
      "Notebook para produtividade com tela de alta resolucao e bateria de longa duracao.",
    price: 5299.9,
    imageUrl: "http://localhost:3001/images/notebook.svg",
  },
  {
    name: "Headphone Studio X",
    category: "audio",
    description:
      "Fone over-ear com cancelamento de ruido para musica, trabalho e jogos.",
    price: 799.5,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mouse Precision Air",
    category: "perifericos",
    description:
      "Mouse sem fio ergonomico com sensores de alta precisao para uso diario.",
    price: 249.0,
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Monitor UltraWide 29",
    category: "monitores",
    description:
      "Monitor ultrawide para multitarefa com painel IPS e cores vibrantes.",
    price: 1899.99,
    imageUrl: "http://localhost:3001/images/monitor.svg",
  },
];

export { productsSeed };
