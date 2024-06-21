import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import './RequestBookings.css';

function RequestBookings() {
  const [filteredRentData, setFilteredRentData] = useState([]);

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
      {
        Header: 'Accept/Reject',
        accessor: 'id',
        Cell: ({ row }) => (
          <div>
            <button className="bg-success btn mb-1 text-light" onClick={() => handleAccept(row.original.id)}>
              Accept
            </button>
            <button className="btn px-3 redColor" onClick={() => handleReject(row.original.id)}>
              Reject
            </button>
          </div>
        ),
      },
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
  
      const response = await axios.get('http://176.119.254.188:8080/provider/orders/pending', config);
  
      if (response && response.data) {
        const bookings = response.data;
        console.log(bookings)
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
                };
              }
            } catch (error) {
              console.error('Error fetching customer data:', error);
              return {
                ...booking,
                customerUsername: 'Unknown',
              };
            }
          })
        );
  
        setFilteredRentData(bookingsWithData);
      }
    } catch (error) {
      console.error('Error fetching data:', error.response.data.message);
      // Show Swal notification for error
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (bookingId) => {
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
  
      const requestBody = {
        orderId: bookingId,
      };
      const response = await axios.post(
        'http://176.119.254.188:8080/provider/order/accept',
        requestBody,
        config
      );
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Booking Accepted!',
        text: 'The booking has been accepted successfully.',
      }).then((result) => {
        // Reload the page after displaying the success message
        if (result.isConfirmed || result.isDismissed) {
          fetchData(); // Refresh data
        }
      });
    } catch (error) {
      console.error('Error accepting booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data,
      });
    }
  };

  const handleReject = async (bookingId) => {
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
  
      const requestBody = {
        orderId: bookingId,
      };
      const response = await axios.post(
        'http://176.119.254.188:8080/provider/order/reject',
        requestBody,
        config
      );
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Booking Rejected!',
        text: 'The booking has been Rejected successfully.',
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          fetchData(); // Refresh data
        }
      });
    } catch (error) {
      console.error('Error rejecting booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data,
      });
    }
  };
  
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
        {data.length === 0 ? (
          <p className="mt-3">No pending bookings found.</p>
        ) : (
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

export default RequestBookings;
