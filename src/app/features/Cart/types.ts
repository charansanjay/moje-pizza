export interface CartType {
  id?: string;
  customer_id: string;
  items: CartItemType[] | [];
  cartSummary: {
    subtotal: number;
    deliveryCost: number;
    vat: number;
    discountAmount: number;
    grandTotal: number;
    vatRatePercentage: number;
    discountPercentage: number;
  };
  itemsCount: number;
  itemsQuantity: number;
  isActive: boolean;
  currency?: string;
}

export interface CartItemType {
  item_id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  quantity: number;
  rowTotal: number;
  maxOrderQuantity: number;
  currency: string;
}