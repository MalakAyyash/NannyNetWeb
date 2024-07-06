import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function UserRequestBookings() {
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
  
      const response = await axios.get('http://176.119.254.188:8080/customer/orders/pending', config);
  
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
      initialState: { pageSize: 3 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-center'>
        {data.length === 0 ? ( // Check if data array is empty
          <div className="text-center mb-3">
            <p className='mt-3'>You've got nothing pinned at the moment</p>
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
              {Object.keys(groupedData).map((key) => {
                const orders = groupedData[key];
                const firstOrder = orders[0];
                return (
                  <React.Fragment key={key}>
                    <tr>
                      <td colSpan={columns.length} className="text-center">
                        <div className='row'>
                          <div className='col-md-10 d-flex justify-content-center'>
                          <p className='ordersOverView'>You have {orders.length} pending orders from {firstOrder.startTime} to {firstOrder.endTime}</p>
                          </div>
                          <div className='col-md-2 d-flex justify-content-end my-1'>
                          <button className='w-100 border-0 btn BlueColor text-light' onClick={() => handleRowClick(key)}>
                          {expandedRows[key] ? 'Hide' : 'Show'}
                        </button>
                        </div>
                        </div>
                      </td>
                    </tr>
                    {expandedRows[key] && orders.map(order => {
                      return (
                        <tr key={order.id} className='text-center'>
                          <td className='border'>
                            <Link
                              to={`/babysitter-profile/${order.babysitter.user.id}`}
                              className='textRedColor'
                            >
                              {order.babysitterName}
                            </Link>
                          </td>
                          <td className='border'>{order.price}</td>
                          <td className='border'>{order.babysitterType}</td>
                          <td className='border'>{order.startTime}</td>
                          <td className='border'>{order.endTime}</td>
                        </tr>
                      );
                    })}
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
      <hr></hr>
    </div>
  );
}

export default UserRequestBookings;
