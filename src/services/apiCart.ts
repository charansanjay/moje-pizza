import { MenuItemType } from './../pages/Menu/Menu.tsx';
import supabase from '../utils/supabase.ts';

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

const calculateCartSummary = (cartData: CartType) => {
  // Calculate totals
  const subtotal = parseFloat(
    cartData.items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
  );
  const discountPercentage = cartData.cartSummary.discountPercentage ?? 0;
  const deliveryCost = 5.0; // Fixed delivery cost
  const vatRatePercentage = 10; // 10% VAT
  const vat = (subtotal * vatRatePercentage) / 100;
  const discountAmount = (subtotal * discountPercentage) / 100;
  const grandTotal = parseFloat(
    (subtotal + deliveryCost + vat - discountAmount).toFixed(2)
  );

  return {
    subtotal,
    deliveryCost,
    vat,
    vatRatePercentage,
    discountPercentage,
    discountAmount,
    grandTotal,
  };
};

const calculateCartItemsQuantity = (cartItems: CartItemType[]) => {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
};

const calculateSummaryItemsquantityItemscount = (cartData: CartType) => {
  const cartSummary = calculateCartSummary(cartData);
  const cartItemsQuantity = calculateCartItemsQuantity(cartData.items);
  const itemsCount = cartData.items.length;

  return {
    ...cartData,
    cartSummary,
    itemsQuantity: cartItemsQuantity,
    itemsCount: itemsCount,
  };
};

const resetCartSummary = () => {
  return {
    subtotal: 0,
    deliveryCost: 5.0,
    vat: 0,
    discountAmount: 0,
    grandTotal: 0,
    vatRatePercentage: 10,
    discountPercentage: 0,
  };
};

/* API CALLS */
export const fetchCustomerCart = async (cart_id: string) => {
  const { data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('id', cart_id);

  if (error) {
    throw Error('Failed fetching cart items');
  }

  return { data: data[0] as CartType };
};

export const createCart = async (newCart: CartType) => {
  const { data, error } = await supabase
    .from('carts')
    .insert([newCart])
    .select();

  if (error) {
    throw Error(error.message);
  }

  return data;
};

export const addOrUpdateCartItem = async (
  itemToAdd: MenuItemType,
  customerCart: CartType
) => {
  /* Create a new cart item object */
  const newCartItem: CartItemType = {
    item_id: itemToAdd.id,
    name: itemToAdd.name,
    imageUrl: itemToAdd.image_url,
    description: itemToAdd.description,
    price: itemToAdd.price,
    quantity: 1,
    rowTotal: itemToAdd.price * 1,
    maxOrderQuantity: itemToAdd.max_order_quantity,
    currency: itemToAdd.currency,
  };

  // make a deep copy of the cart
  const cart = JSON.parse(JSON.stringify(customerCart));

  // Todo: create a custom utils hook for each if condition
  // 1. Check if the current item exists inside the items array
  const itemExistInCart = cart.items.find(
    (item: CartItemType) => item.item_id === itemToAdd.id
  );

  // 2. if item does not exist, add item to items array
  if (itemExistInCart === undefined) {
    cart.items.push(newCartItem);
  }

  // 3. If item exists and the quantity is equal to the maxOrderQuantity, throw an error
  if (
    itemExistInCart &&
    itemExistInCart.quantity === itemExistInCart.maxOrderQuantity
  ) {
    throw Error(
      `You can only order ${itemExistInCart.maxOrderQuantity} of this item`
    );
  }

  // 4. If item exists and the quantity is less than the maxOrderQuantity, increase the quantity
  if (itemExistInCart) {
    cart.items = cart.items.map((item: CartItemType) => {
      if (item.item_id === itemToAdd.id) {
        item.quantity =
          item.quantity < item.maxOrderQuantity
            ? item.quantity + 1
            : item.quantity;
        item.rowTotal = item.quantity * item.price;
      }
      return item;
    });
  }

  // 5. calculate summary, itemsQuantity and items count
  const updatedCart = calculateSummaryItemsquantityItemscount(cart);

  // 6. update the cart in the database
  const { data, error } = await supabase
    .from('carts')
    .update(updatedCart)
    .eq('id', cart.id)
    .select();

  if (error) {
    throw Error('Failed to Update cart');
  }

  return data[0] as CartType;
};

export const updateCartItemQuantity = async (
  itemToUpdate: CartItemType,
  cartData: CartType
) => {
  const updatedItems = cartData.items.map((item) => {
    if (item.item_id === itemToUpdate.item_id) {
      item = itemToUpdate;
    }
    return item;
  });

  const newCart = { ...cartData, items: updatedItems };

  const updatedCart = calculateSummaryItemsquantityItemscount(newCart);

  // update the cart
  const { data, error } = await supabase
    .from('carts')
    .update(updatedCart)
    .eq('id', cartData.id)
    .select();

  if (error) {
    throw Error('Failed to increase item quantity');
  }

  return data[0] as CartType;
};

export const deleteCartItem = async (
  itemToDelete: CartItemType,
  cartData: CartType
) => {
  cartData.items = cartData.items.filter(
    (item) => item.item_id !== itemToDelete.item_id
  );

  const newCart = { ...cartData };

  const updatedCart = calculateSummaryItemsquantityItemscount(newCart);

  // If one item left in cart, reset the cart summary
  if (cartData.items.length === 0) {
    updatedCart.cartSummary = resetCartSummary();
  }

  // update the cart
  const { data, error } = await supabase
    .from('carts')
    .update(updatedCart)
    .eq('id', cartData.id)
    .select();

  if (error) {
    throw Error('Failed to delete item from cart');
  }

  return data[0] as CartType;
};

export const applyCouponDiscount = async (
  customerCart: CartType,
  couponCode: string
) => {
  // check if the coupon code is DISCOUNT15
  if (couponCode === 'DISCOUNT15') {
    const updatedCartObject = {
      ...customerCart,
      cartSummary: {
        ...customerCart.cartSummary,
        discountPercentage: 15,
      },
    };

    const updatedCart =
      calculateSummaryItemsquantityItemscount(updatedCartObject);

    // update the cart
    const { data, error } = await supabase
      .from('carts')
      .update(updatedCart)
      .eq('id', customerCart.id)
      .select();

    if (error) {
      throw Error('Failed to apply coupon discount');
    }

    return data[0] as CartType;
  } else {
    throw Error('Invalid coupon code');
  }
};

export const resetCart = async (cart_id: string) => {
  const { data, error } = await supabase
    .from('carts')
    .update({
      items: [],
      cartSummary: resetCartSummary(),
      itemsCount: 0,
      itemsQuantity: 0,
    })
    .eq('id', cart_id)
    .select();

  if (error) {
    throw Error('Failed to reset cart');
  }

  return data[0] as CartType;
};
