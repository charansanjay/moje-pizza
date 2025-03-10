import styles from './OrdersList.module.css';

import { useMemo, useState } from 'react';
import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

/* components */
import { Loader } from '../../../components/Loader/Loader.tsx';
import { useCustomerOrders } from '../../../customHooks/useCustomerOrders.tsx';
import { EmptyPage } from '../../../components/EmptyPage/EmptyPage.tsx';
import { PageHeading } from '../../../components/PageHeading/PageHeading.tsx';
import { Pagination } from '../../../components/Pagination/Pagination.tsx';
import { FilterSort } from '../../../components/FilterSort/FilterSort.tsx';
import { Sort } from '../../../components/FilterSort/Sort/Sort.tsx';
import { ItemsPerPage } from '../../../components/FilterSort/ItemsPerPage/ItemsPerPage.tsx';

/* redux/utils */
import { setSelectedOrder } from '../../../redux/slices/orderSlice/orderSlice.ts';
import { formatDate } from '../../../utils/helpers.ts';
import { calculatePaginatedItems } from '../../../utils/calculatePaginatedItems.ts';

/* icons/images */
import {
  FaBoxOpen,
  FaLongArrowAltDown,
  FaLongArrowAltUp,
} from 'react-icons/fa';

/* types */
import { type CustomerType } from '../../../services/apiCustomer.ts';
import { type AppDispatch } from '../../../redux/store.ts';
import { type OrderType } from '../../../services/apiOrder.ts';
import { type SortOptionsType } from '../../Menu/Menu.tsx';
import { type SortCaseType } from '../../../customHooks/useSort.tsx';

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
          buttonText='Shop Now'
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
