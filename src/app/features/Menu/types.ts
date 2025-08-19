export interface MenuItemType {
  id: number;
  image_url: string;
  description: string;
  name: string;
  sold_out: boolean;
  price: number;
  max_order_quantity: number;
  currency: string;
}