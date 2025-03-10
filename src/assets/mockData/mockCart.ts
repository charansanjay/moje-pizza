import { CartType } from '../../services/apiCart';

export const mockEmptyCart: CartType = {
  id: '44',
  cartSummary: {
    vat: 0,
    subtotal: 0,
    grandTotal: 0,
    deliveryCost: 0,
    discountAmount: 0,
    vatRatePercentage: 0,
    discountPercentage: 0,
  },
  isActive: true,
  itemsQuantity: 0,
  customer_id: '123',
  items: [],
  itemsCount: 0,
  currency: 'Kč‎',
};

export const mockCart: CartType = {
  id: '44',
  cartSummary: {
    vat: 43.4,
    subtotal: 434,
    grandTotal: 482.4,
    deliveryCost: 5,
    discountAmount: 0,
    vatRatePercentage: 10,
    discountPercentage: 0,
  },
  isActive: true,
  itemsQuantity: 2,
  customer_id: '123',
  items: [
    {
      name: 'Blazing Onion & Paprika Pizza',
      price: 274,
      item_id: 17,
      imageUrl:
        'https://aexxqpvgoarvercfekhl.supabase.co/storage/v1/object/public/moje_pizza_images//blazing_onion_paprika_pizza.webp',
      quantity: 1,
      rowTotal: 274,
      description:
        'Molten Cheese Indulgence with onion & red paprika toppings along with spicy peri peri sauce',
      maxOrderQuantity: 10,
      currency: 'Kč‎',
    },
    {
      name: 'Margherita Pizza',
      price: 160,
      item_id: 1,
      imageUrl:
        'https://aexxqpvgoarvercfekhl.supabase.co/storage/v1/object/public/moje_pizza_images//margherita_pizza.avif',
      quantity: 1,
      rowTotal: 160,
      description:
        'Classic delight with 100% real mozzarella cheese. Wheat Pan Crust.',
      maxOrderQuantity: 10,
      currency: 'Kč‎',
    },
  ],
  itemsCount: 2,
  currency: 'Kč‎',
};
