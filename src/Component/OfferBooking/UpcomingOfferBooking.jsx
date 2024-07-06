import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function UpcomingOfferBookings() {
  const [filteredRentData, setFilteredRentData] = useState([]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Babysitter Name',
        accessor: 'babysitterName',
        Cell: ({ row }) => (
          <Link className='textRedColor' to={`/babysitter-profile/${row.original.babysitter.user.id}`}>
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
            <button className="btn btn-warning mr-2" onClick={() => handleCancel(row.original.id)}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={() => handleSubmit(row.original.id)}>
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

      const response = await axios.get('http://176.119.254.188:8080/customer/offer/orders/accepted', config);

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

  const handleSubmit = async (bookingId) => {
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

      const response = await axios.post('http://176.119.254.188:8080/customer/offer/order/submit', requestBody, config);
      console.log(response.data);

      // Show success message using Swal
      Swal.fire({
        icon: 'success',
        title: 'Order Submitted!',
        text: 'The order has been submitted successfully.',
      }).then(() => {
        // Refresh data after submission
        fetchData();
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error submitting order',
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
          <div className="text-center mb-3">
            <p className='mt-3'>You`ve got nothing booked at the moment</p>
            <div className=''>
              <Link to={`/BabysittersList`} className='text-decoration-none'>
                <p className='mb-5 redText'>Check Out Our Services</p>
              </Link>
            </div>
          </div>
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

export default UpcomingOfferBookings;
