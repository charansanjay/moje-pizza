import styles from './CartItems.module.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Modal } from '../../../components/Modal/Modal.tsx';

import { MdDelete } from 'react-icons/md';

import { setToast } from '../../../redux/slices/settingsSlice/settingsSlice.ts';
import { FaMinus, FaPlus } from 'react-icons/fa';

import { CartItemType, CartType } from '../../../services/apiCart.ts';

import { Loader } from '../../../components/Loader/Loader.tsx';

import { useCartMutation } from '../../../customHooks/mutationHooks/useCartMutation.tsx';

import { type AppDispatch } from '../../../redux/store.ts';

export interface QuantityUpdateObjectType {
  valueToUpdate: number;
  itemToUpdate: CartItemType;
}

interface cartItemsPropsType {
  cartData: CartType;
  showActions: boolean;
}

export const CartItems = ({ showActions, cartData }: cartItemsPropsType) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartItemType | null>(null);

  /* react-query cart mutation query */
  const { isLoading, deleteCartItem, updateCartItemQuantity } =
    useCartMutation();

  const handleDelete = (item: CartItemType) => {
    setIsModalOpen(true);
    setItemToDelete(item);
  };

  // Handle actual deletion
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setIsModalOpen(false);

      const cartObject = {
        itemToDelete: itemToDelete,
        cartData: { ...cartData },
      };
      deleteCartItem(cartObject);
      return;
    }
    dispatch(
      setToast({
        message: 'No item to delete',
        type: 'error',
        disableAutoClose: true,
      })
    );
  };

  const handleUpdateQuantity = (itemToUpdate: CartItemType) => {
    if (itemToUpdate.quantity > itemToUpdate.maxOrderQuantity) {
      dispatch(
        setToast({
          message: `You can only order ${itemToUpdate.maxOrderQuantity} of this item`,
          type: 'error',
          disableAutoClose: true,
        })
      );
      return;
    }

    const cartObject = {
      itemToUpdate: itemToUpdate,
      cartData: { ...cartData },
    };
    updateCartItemQuantity(cartObject);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            {/* <th>Ingredients</th> */}
            <th>Quantity</th>
            <th>Price</th>
            <th>RowTotal</th>
            {showActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {cartData.items.map((item) => (
            <tr key={item.item_id}>
              {/* Image */}
              <td>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className={styles.itemImage}
                />
              </td>

              {/* Name */}
              <td>
                <div className={styles.nameCell}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.description}>{item.description}</p>
                </div>
              </td>

              {/* Quantity */}
              <td>
                <div className={styles.quantityCell}>
                  {showActions && (
                    <button
                      className={styles.quantityButton}
                      onClick={() =>
                        handleUpdateQuantity({
                          ...item,
                          quantity: item.quantity - 1,
                          rowTotal: (item.quantity - 1) * item.price,
                        })
                      }
                      disabled={item.quantity === 1 ? true : false}
                    >
                      <FaMinus />
                    </button>
                  )}

                  <p className={styles.quantityValue}>{item.quantity}</p>

                  {showActions && (
                    <button
                      className={styles.quantityButton}
                      onClick={() =>
                        handleUpdateQuantity({
                          ...item,
                          quantity: item.quantity + 1,
                          rowTotal: (item.quantity + 1) * item.price,
                        })
                      }
                      disabled={
                        item.quantity === item.maxOrderQuantity ? true : false
                      }
                    >
                      <FaPlus data-testid='plus_icon' />
                    </button>
                  )}
                </div>
              </td>

              {/* Price */}
              <td>
                {item.price}&nbsp;{cartData.currency}
              </td>

              {/* Row Total */}
              <td>
                {item.rowTotal}&nbsp;{cartData.currency}
              </td>

              {/* Delete Button */}
              {showActions && (
                <td>
                  <div
                    onClick={() => handleDelete(item)}
                    className={styles.deleteButton}
                  >
                    <MdDelete data-testid='delete_icon' className={styles.deleteIcon} />
                  </div>
                  {/* Modal for delete confirmation */}
                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title='Delete Product'
                    message='Are you sure you want to delete this product from your cart?'
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
