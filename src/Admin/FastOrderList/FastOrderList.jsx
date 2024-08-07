import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function FastOrderList() {
  const [ordersData, setOrdersData] = useState([]);
  const navigate = useNavigate();


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
              <Link className='textRedColor text-center' to={`/admin/CustomerInfoStatus/${customer.user.id}`}>
                {customer.user.name}
              </Link>
            );
          }
          return null;
        },
      },
      { Header: 'Price', accessor: 'price',
        Cell: ({ value }) => parseFloat(value).toFixed(2) }, // Format to 2 decimal places
      { Header: '#Kids', accessor: 'numOfKids',
        Cell: ({ value }) => Math.floor(value) }, // Display whole number
      { Header: 'Submitted Date', accessor: 'orderSubmittedDate' },
      { Header: 'Description', accessor: 'describtion' },
      { Header: 'Order Date', accessor: 'orderDate' },
      { Header: 'Start Time', accessor: 'startTime' },
      { Header: 'End Time', accessor: 'endTime' },
      { Header: 'Status', accessor: 'orderStatus' },
      {
        Header: 'Manage Order',
        accessor: 'manageOrder',
        Cell: ({ row }) => (
          <button
            onClick={() => handleManageOrderClick(row.original.id)}
            className="btn BlueColor text-light rounded-0 p-0"
          >
            Manage Order
          </button>
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

      const response = await axios.get('http://176.119.254.188:8080/getAllOrders', config);

      if (response && response.data) {
        const orders = response.data.filter(order => !order.employee || !order.employee.user);
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

    // Function to render star rating
    const renderStarRating = (stars) => {
      const starElements = [];
      for (let i = 1; i <= 5; i++) {
          if (i <= stars) {
              // Render a filled star
              starElements.push(<i key={i} className="fa-solid fa-star text-warning"></i>);
          } else {
              // Render an empty star
              starElements.push(<i key={i} className="fa-regular fa-star text-secondary"></i>);
          }
      }
      return starElements;
  };

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
      initialState: { pageSize: 5 },
    },
    useSortBy,
    usePagination
  );

  const handleManageOrderClick = (id) => {
    navigate(`/admin/suggestedBabysitters/${id}`);
  };

  return (
    <div className="container mt-4">
      <div className='DetaliedBook'>
        <p className='mt-4 fst-normal'>All Fast Request</p>
      </div>
      <p className='small text-secondary fst-normal'>Manage the list of All fast Bookings below.</p>
      <hr></hr>
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

export default FastOrderList;
