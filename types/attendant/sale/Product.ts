export interface ProductItem {
  id: string;
  name: string;
  category: string;
  catalogo: string;
  price: number;
  stock: number;
  isFixedPortion?: boolean;
  isWeightBased?: boolean;
  pricePerGram?: number;
  minWeight?: number;
}