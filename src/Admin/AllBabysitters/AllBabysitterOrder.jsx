import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function AllBabysitterOrder() {
  const [ordersData, setOrdersData] = useState([]);
  const { id } = useParams();
  
  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      {
        Header: 'Customer',
        accessor: 'customer.user.name',
        Cell: ({ row }) => {
          const customer = row.original.customer;
          if (customer && customer.user) {
            return (
              <Link className='textRedColor' to={`/admin/CustomerInfoStatus/${customer.user.id}`}>
                {customer.user.name}
              </Link>
            );
          }
          return null;
        },
      },
      {
        Header: 'Employee',
        accessor: 'employee.user.name',
        Cell: ({ row }) => {
          const employee = row.original.employee;
          if (employee && employee.user) {
            return (
              <Link className='textRedColor' to={`/admin/BabysitterInfoStatus/${employee.user.id}`}>
                {employee.user.name}
              </Link>
            );
          }
          return null;
        },
      },
      { Header: 'Price', accessor: 'price' },
      { Header: '#Kids', accessor: 'numOfKids' },
      { Header: 'Submitted Date', accessor: 'orderSubmittedDate' },
      { Header: 'Order Date', accessor: 'orderDate' },
      { Header: 'Start Time', accessor: 'startTime' },
      { Header: 'End Time', accessor: 'endTime' },
      { Header: 'Status', accessor: 'orderStatus' },
    ],
    []
  );

  const fetchData = async () => {
    try {
      const token = Cookies.get('jwt');
      if (!token) {
        console.error('Token not found.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        'http://176.119.254.188:8080/admin/order/get/employee',
        { employeeId: id },
        config
      );
      if (response && response.data) {
        const orders = response.data;
        setOrdersData(orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Unknown error occurred.',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = React.useMemo(() => ordersData, [ordersData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canNextPage,
    canPreviousPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 }, // Ensure pageSize is set to 13
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="container mt-4">
      <div className='DetaliedBook'>
        <p className='mt-4 profileTitle'>All Bookings</p>
        <p className='small text-secondary fst-normal'>Review the list of All Bookings below.</p>
        <hr></hr>
      </div>
      <div className='d-flex justify-content-center'>
        <table {...getTableProps()} className="table table-striped">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <div className="d-flex justify-content-center">
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaCaretSquareDown />
                          ) : (
                            <FaCaretSquareUp />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="text-center">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <div className="d-flex justify-content-center mt-4">
          <button disabled={!canPreviousPage} onClick={() => previousPage()}>
            Previous Page
          </button>
          <button disabled={!canNextPage} onClick={() => nextPage()}>
            Next Page
          </button>
        </div>
        <div>
          <span className="text-light">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AllBabysitterOrder;
