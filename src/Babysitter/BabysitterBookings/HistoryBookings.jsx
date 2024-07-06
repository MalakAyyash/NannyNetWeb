import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import './RequestBookings.css';

function HistoryBookings() {
  const [filteredRentData, setFilteredRentData] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state

  const columns = React.useMemo(
    () => [
      {
        Header: 'Customer Username',
        accessor: 'customerUsername',
        Cell: ({ row }) => (
          <Link className='textRedColor' to={`/user-profile/${row.original.customer.user.id}`}>
            {row.original.customerUsername}
          </Link>
        ),
      },
      { Header: 'Price', accessor: 'price' },
      { Header: 'Number of Kids', accessor: 'numOfKids' },
      {
        Header: 'City/Street',
        accessor: 'orderLocation',
        Cell: ({ value }) => `${value.city}/${value.streetData}`,
      },
      { Header: 'Start Time', accessor: 'startTime' },
      { Header: 'End Time', accessor: 'endTime' },
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

      const response = await axios.get('http://176.119.254.188:8080/provider/order/history', config);

      if (response && response.data) {
        const bookings = response.data;
        const bookingsWithData = await Promise.all(
          bookings.map(async (booking) => {
            const customerId = booking.customer.user.id;

            try {
              const customerResponse = await axios.get(`http://176.119.254.188:8080/customer/${customerId}`, config);

              if (customerResponse && customerResponse.data) {
                const customerUsername = customerResponse.data.user.username;
                return {
                  ...booking,
                  customerUsername,
                  customer: customerResponse.data,
                };
              }
            } catch (error) {
              console.error('Error fetching customer data:', error);
              return {
                ...booking,
                customerUsername: 'Unknown',
                customer: {},
              };
            }
          })
        );

        setFilteredRentData(bookingsWithData);
      }

      setLoading(false); // Set loading state to false after data fetch
    } catch (error) {
      console.error('Error fetching data:', error.response?.data?.message || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching booking data',
      });
      setLoading(false); // Set loading state to false on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Removed dependencies to avoid unnecessary re-renders

  const data = React.useMemo(() => filteredRentData, [filteredRentData]);

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
      initialState: { pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-center'>
        {loading ? ( // Display loading state
          <div>Loading...</div>
        ) : data.length === 0 ? ( // Check if data array is empty
          <div className="text-center mb-3">
            <p className='mt-3'>No history bookings found.</p>
          </div>
        ) : (
          <table {...getTableProps()} className="table table-striped" style={{ borderSpacing: '0 8px' }}>
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
                  <tr {...row.getRowProps()} className='table-row'>
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
        )}
      </div>
      {data.length > 0 && (
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
      )}
    </div>
  );
}

export default HistoryBookings;
