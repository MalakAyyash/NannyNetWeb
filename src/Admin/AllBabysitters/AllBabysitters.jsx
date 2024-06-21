import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function AllBabysitters() {
  const [babysittersData, setBabysittersData] = useState([]);
  const renderStarRating = (stars) => {
    const starElements = [];
    for (let i = 1; i <= 5; i++) {
      starElements.push(
        <i
          key={i}
          className={`fa ${i <= stars ? 'fa-star text-warning' : 'fa-star text-secondary'}`}
          style={{ fontSize: '10px' }}
        ></i>
      );
    }
    return starElements;
  };
  
  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'babysitter.user.id' },
      { Header: 'Username', accessor: 'babysitter.user.username' },
      {
        Header: 'Name',
        accessor: 'user.name',
        Cell: ({ row }) => (
          <Link className='textRedColor' to={`/admin/BabysitterInfoStatus/${row.original.user.id}`}>
            {row.original.user.name}
          </Link>
        ),
      },
      { Header: 'Email', accessor: 'babysitter.user.email' },
      { Header: 'Gender', accessor: 'babysitter.user.gender' },
      { Header: 'Date Added', accessor: 'babysitter.user.dateAdded' },
      { Header: 'Type', accessor: 'babysitterType' },
      { Header: 'City', accessor: 'city' },
      { Header: 'Availability', accessor: 'availability' },
      { Header: 'Phone', accessor: 'babysitter.user.telNumber' },
      { Header: 'Date of Birth', accessor: 'dateOfBirth' },
      { Header: 'Stars', accessor: 'stars', Cell: ({ value }) => renderStarRating(value) },
      { Header: '#Cancellations', accessor: 'numOfCancelation' },
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

      const response = await axios.get('http://176.119.254.188:8080/admin/getAllEmployees');

      if (response && response.data) {
        const bookings = response.data;
        const bookingsWithData = await Promise.all(
          bookings.map(async (booking) => {
            const babysitterId = booking.user?.id;

            if (!babysitterId) {
              console.error('Invalid babysitter ID found.');
              return null;
            }

            try {
              const babysitterResponse = await axios.get(`http://176.119.254.188:8080/employee/${babysitterId}`, config);

              if (babysitterResponse && babysitterResponse.data) {
                const babysitterName = babysitterResponse.data.user.name;
                const babysitterType = booking.type; // Assuming this is the type of babysitter from the booking
                const city = booking.city; // Assuming this is the city of the booking
                const availability = booking.availability;
                const dateOfBirth = babysitterResponse.data.dateOfBirth;
                const stars = booking.stars;
                const numOfCancelation = booking.numOfCancelation;

                return {
                  ...booking,
                  babysitterName,
                  babysitterType,
                  city,
                  availability,
                  dateOfBirth,
                  stars,
                  numOfCancelation,
                  babysitter: babysitterResponse.data,
                };
              }
            } catch (error) {
              console.error('Error fetching babysitter data:', error);
              return {
                ...booking,
                babysitterName: 'Unknown',
                babysitterType: 'Unknown',
                city: 'Unknown',
                availability: 'Unknown',
                dateOfBirth: 'Unknown',
                stars: 0,
                numOfCancelation: 0,
                babysitter: {},
              };
            }
          })
        );

        setBabysittersData(bookingsWithData.filter(Boolean)); // Filter out null values
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

  const data = React.useMemo(() => babysittersData, [babysittersData]);

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
      <div className='DetaliedBook'>
        <p className='mt-4 profileTitle'>All Babysitters</p>
        <p className='small text-secondary fst-normal'>Review the list of All babysitters below.</p>
        <hr></hr>
      </div>
      <div className='d-flex justify-content-center ps-5'>
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

export default AllBabysitters;
