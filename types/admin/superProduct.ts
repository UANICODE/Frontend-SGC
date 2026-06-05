export interface SuperProductEstablishment {
  establishmentName: string;
  stock: number;
  price: number;
  lastEntry: string;
}

export interface SuperProduct {
  productName: string;
  imageUrl: string;
  category: string;
  totalStock: number;
  establishments: SuperProductEstablishment[];
}