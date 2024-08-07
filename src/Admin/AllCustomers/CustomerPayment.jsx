import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function CustomerPayment({id}) {
  const [paymentsData, setPaymentsData] = useState([]);

  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      {
        Header: 'Customer Name',
        accessor: 'order.customer.user.name',
        Cell: ({ row }) => {
          const customer = row.original.order.customer;
          if (customer) {
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
        Header: 'Babysitter Name',
        accessor: 'order.employee.user.name',
        Cell: ({ row }) => {
          const employee = row.original.order.employee;
          if (employee) {
            return (
              <Link className='textRedColor' to={`/admin/BabysitterInfoStatus/${employee.user.id}`}>
                {employee.user.name}
              </Link>
            );
          }
          return null;
        },
      },
      { Header: 'Type', accessor: 'type' },
      { Header: 'Total Customer Value', accessor: 'totalCustomerValue' },
      { Header: 'Value to Admin', accessor: 'valueToAdmin' },
      { Header: 'Value to Babysitter', accessor: 'valueToBabysitter' },
      { Header: 'Order Date', accessor: 'order.orderDate' },
      { Header: 'Order Status', accessor: 'order.orderStatus' },
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

      const response = await axios.get(`http://176.119.254.188:8080/admin/payments/customer/${id}`, config);

      if (response && response.data) {
        setPaymentsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
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

  const data = React.useMemo(() => paymentsData, [paymentsData]);

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
      initialState: { pageSize: 5 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="container mt-4">
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

export default CustomerPayment;
