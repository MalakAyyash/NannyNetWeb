import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function UserUpcomingBookings() {
  const [filteredRentData, setFilteredRentData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  const columns = React.useMemo(
    () => [
      {
        Header: 'Babysitter Name',
        accessor: 'babysitterName',
        Cell: ({ row }) => (
          <Link
            to={`/babysitter-profile/${row.original.babysitter.user.id}`}
            className='textRedColor'
          >
            {row.original.babysitterName}
          </Link>
        ),
      },
      { Header: 'Price', accessor: 'price' },
      {
        Header: 'Type of Babysitter',
        accessor: 'babysitterType',
      },
      {
        Header: 'City/Street',
        accessor: 'orderLocation',
        Cell: ({ value }) => `${value.city}/${value.streetData}`,
      },
      { Header: 'Start Time', accessor: 'startTime' },
      { Header: 'End Time', accessor: 'endTime' },
      {
        Header: 'Tel Number',
        accessor: 'employee.user.telNumber',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: ({ row }) => (
          <div>
            <button className="btn btn-warning mr-2" onClick={() => handleCancel(row.original?.id)}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={() => handleSubmit(row.original)}>
              Submit
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

      const response = await axios.get('http://176.119.254.188:8080/customer/orders/accepted', config);

      if (response && response.data) {
        const bookings = response.data;
        const bookingsWithData = await Promise.all(
          bookings.map(async (booking) => {
            const babysitterId = booking.employee?.user?.id;

            if (!babysitterId) {
              console.error('Invalid babysitter ID found.');
              return null;
            }

            try {
              const babysitterResponse = await axios.get(`http://176.119.254.188:8080/employee/${babysitterId}`, config);

              if (babysitterResponse && babysitterResponse.data) {
                const babysitterName = babysitterResponse.data.user.username;
                const babysitterType = babysitterResponse.data.type;
                return {
                  ...booking,
                  babysitterName,
                  babysitterType,
                  babysitter: babysitterResponse.data,
                };
              }
            } catch (error) {
              console.error('Error fetching babysitter data:', error);
              return {
                ...booking,
                babysitterName: 'Unknown',
                babysitterType: 'Unknown',
                babysitter: {},
              };
            }
          })
        );

        setFilteredRentData(bookingsWithData.filter(Boolean)); // Filter out null values
      } else {
        // Handle case where no data is returned
        console.log('No data returned from API');
        setFilteredRentData([]); // Set empty array to show no bookings
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleCancel = async (bookingId) => {
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

      const response = await axios.post('http://176.119.254.188:8080/customer/order/cancel', requestBody, config);
      console.log(response.data);

      // Show success message using Swal
      Swal.fire({
        icon: 'success',
        title: 'Order Cancelled!',
        text: 'The order has been cancelled successfully.',
      }).then(() => {
        // Refresh data after cancellation
        fetchData();
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error cancelling order',
      });
    }
  };

  const handleSubmit = async (order) => {
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
        orderId: order.id,
      };
  
      // Show SweetAlert for payment details
      const { value: formValues, dismiss } = await Swal.fire({
        title: 'Enter Payment Details',
        html:`
       <div class="form-group mb-3">
            <input type="text" id="swal-input1" class="form-control" placeholder="Card Number (16 digits)" maxlength="16">
          </div>
          <div class="form-group mb-3">
            <input type="text" id="swal-input2" class="form-control" placeholder="CVC (3 digits)" maxlength="3">
          </div>
          <div class="form-group mb-3">
            <select id="swal-input3" class="form-control">
              <option value="">-- Expiry Month --</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div class="form-group mb-3">
            <select id="swal-input4" class="form-control">
              <option value="">-- Expiry Year --</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Pay',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          return {
            cardNumber: document.getElementById('swal-input1').value,
            cvc: document.getElementById('swal-input2').value,
          };
        },
      });
  
      if (dismiss === Swal.DismissReason.cancel) {
        // User clicked cancel on SweetAlert
        return;
      }
  
      if (formValues && formValues.cardNumber && formValues.cvc) {
        // Handle order submission API call with formValues.cardNumber and formValues.cvc
        const submitOrderRequest = {
          ...requestBody,
          cardNumber: formValues.cardNumber,
          cvc: formValues.cvc,
        };
  
        const response = await axios.post('http://176.119.254.188:8080/customer/order/submit', submitOrderRequest, config);
        console.log(response.data);
  
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Order Submitted Successfully!',
          text: 'Your order has been submitted successfully.',
        });
  
        // Refresh data after successful order submission
        fetchData();
      } else {
        // User clicked confirm without entering card details
        Swal.fire({
          icon: 'error',
          title: 'Invalid Payment Details',
          text: 'Please enter valid card details to proceed with payment.',
        });
      }
    } catch (error) {
      console.error('Error submitting order:', error);
  
      // Handle different errors accordingly
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          // Handle specific error for payment failure or invalid data
          Swal.fire({
            icon: 'error',
            title: 'Payment Error',
            text: 'Payment failed. Please check your payment details and try again.',
          });
        } else if (error.response.status === 401) {
          // Handle unauthorized access or token expiration
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'You are not authorized to perform this action. Please login again.',
          });
        } else {
          // Handle other server errors
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'An error occurred while processing your request. Please try again later.',
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Failed to connect to the server. Please check your internet connection.',
        });
      } else {
        // Something happened in setting up the request that triggered an error
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: 'An unexpected error occurred. Please try again later.',
        });
      }
    }
  };
  
  const groupByTime = (data) => {
    return data.reduce((acc, order) => {
      const key = `${order.startTime}-${order.endTime}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});
  };

  const groupedData = groupByTime(filteredRentData);

  const handleRowClick = (key) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
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
          <div className="text-center mb-3">
            <p className='mt-3'>You`ve got nothing booked at the moment</p>
            <div className=''>
              <Link to={`/BabysittersList`} className='text-decoration-none'>
            <p className='mb-5 redText'>Check Out Our Services</p>
              </Link>
            </div>
          </div>
        ) : (
          <table {...getTableProps()} className="table table-striped table-bordered table-hover table-center booking-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
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
              {Object.keys(groupedData).map((key) => {
                const orders = groupedData[key];
                const firstOrder = orders[0];
                return (
                  <React.Fragment key={key}>
                    <tr>
                      <td colSpan={columns.length} className="text-center">
                        <div className='row'>
                          <div className='col-md-10 d-flex justify-content-center'>
                            <p>You have {orders.length} upcoming orders from {firstOrder.startTime} to {firstOrder.endTime}</p>
                          </div>
                          <div className='col-md-2 d-flex justify-content-end my-1'>
                            <button className='btn BlueColor text-light' onClick={() => handleRowClick(key)}>
                              {expandedRows[key] ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {expandedRows[key] && orders.map((order) => (
                      <tr key={order.id} className='text-center'>
                        <td>
                          <Link
                            to={`/babysitter-profile/${order.babysitter.user.id}`}
                            className='textRedColor'
                          >
                            {order.babysitterName}
                          </Link>
                        </td>
                        <td>{order.price}</td>
                        <td>{order.babysitterType}</td>
                        <td>{order.orderLocation.city}/{order.orderLocation.streetData}</td>
                        <td>{order.startTime}</td>
                        <td>{order.endTime}</td>
                        <td>{order.employee.user.telNumber}</td>
                        <td>
                          <button className="btn btn-warning mr-2" onClick={() => handleCancel(order.id)}>
                            Cancel
                          </button>
                          <button className="btn btn-success" onClick={() => handleSubmit(order)}>
                            Submit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {data.length > 0 && ( // Render pagination controls only when there is data
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

export default UserUpcomingBookings;
