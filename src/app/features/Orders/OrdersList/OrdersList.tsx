import styles from './OrdersList.module.css';

import { useMemo, useState } from 'react';
import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Loader,
  EmptyPage,
  PageHeading,
  Pagination,
  FilterSort,
  Sort,
  ItemsPerPage,
} from '../../../components';

import { useCustomerOrders } from '../hooks/queries/useCustomerOrders';

import { setSelectedOrder } from '../slice/orderSlice';
import { formatDate } from '../../../utils/helpers';
import { calculatePaginatedItems } from '../../../utils/calculatePaginatedItems';

import {
  FaBoxOpen,
  FaLongArrowAltDown,
  FaLongArrowAltUp,
} from 'react-icons/fa';

import { type AppDispatch } from '../../../store/store';
import { type CustomerType } from '../../Authorization';
import { type SortOptionsType } from '../../../components';
import { type SortCaseType } from '../../../shared/hooks/useSort';
import { type OrderType } from '../types';

const options: SortOptionsType[] = [
  {
    value: 'date_asc',
    label: 'Sort by: Newest',
    icon: <FaLongArrowAltUp className={styles.icon} />,
  },
  {
    value: 'date_desc',
    label: 'Sort by: Oldest',
    icon: <FaLongArrowAltDown className={styles.icon} />,
  },
];

export const OrdersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();

  const customer = useSelector(
    (state: { customer: { customerData: CustomerType } }) =>
      state.customer.customerData
  );

  const { orders = [], isLoading: isOrdersLoading } = useCustomerOrders({
    customerId: customer.id!,
  });

  const [filteredItems, setFilteredItems] = useState<OrderType[]>(orders || []);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);

  // Calculate paginated items
  // If the dataset grows large, it optimizes performance by memoizing the paginated items.
  const paginatedItems = useMemo(
    () =>
      calculatePaginatedItems<OrderType>(
        currentPage,
        itemsPerPage,
        filteredItems
      ),
    [currentPage, itemsPerPage, filteredItems]
  );

  const handleViewOrder = (order: OrderType) => {
    dispatch(setSelectedOrder(order));
    navigate('/customer/order-details');
  };

  if (isOrdersLoading) {
    return <Loader />;
  }

  if (orders.length === 0) {
    return (
      <div className={styles.emptyOrderListPage}>
        <EmptyPage
          message='No Orders Found !!'
          buttonText='Order Now'
          path='/menu'
          icon={<FaBoxOpen className={styles.cartIcon} />}
        />
      </div>
    );
  }

  return (
    <div className={styles.ordersListContainer}>
      <PageHeading title='Orders' />

      <FilterSort>
        <Sort<OrderType & SortCaseType>
          options={options}
          itemsToSort={orders}
          setSortedItems={setFilteredItems}
        />

        <ItemsPerPage
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
          itemsPerPage={itemsPerPage}
        />
      </FilterSort>

      <table className={styles.ordersListTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Order Status</th>
            <th>Delivery Status</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((order: OrderType) => {
            const {
              id,
              orderStatus,
              deliveryStatus,
              paymentMethod,
              paymentStatus,
              created_at,
            } = order;
            return (
              <tr key={id}>
                <td className={styles.rowValue}>#{id}</td>
                <td className={styles.rowValue}>
                  {formatDate(created_at || '')}
                </td>
                <td className={styles.rowValue}>{orderStatus}</td>
                <td className={styles.rowValue}>{deliveryStatus}</td>
                <td className={styles.rowValue}>{paymentMethod}</td>
                <td className={styles.rowValue}>{paymentStatus}</td>
                <td className={styles.rowValue}>
                  <p
                    onClick={() => handleViewOrder(order)}
                    className={styles.viewButton}
                  >
                    View
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
