import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

import { Rating } from 'react-simple-star-rating';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareDown, FaCaretSquareUp } from 'react-icons/fa';

import './Feedback.css';

function AllFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = Cookies.get('userId');

  useEffect(() => {
    const fetchFeedbacks = async () => {
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
          customerId: id
        };

        const response = await axios.post('http://176.119.254.188:8080/customer/feedback/search/customer', requestBody, config);

        if (response && response.data) {
          const feedbacksWithBabysitterId = response.data.map(feedback => ({
            ...feedback,
            babysitterId: feedback.employee.user.id
          }));
          setFeedbacks(feedbacksWithBabysitterId);
        } else {
          console.log('No feedbacks returned from API');
          setFeedbacks([]); // Set empty array to show no feedbacks
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [id]);

  
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

  const data = useMemo(() => feedbacks, [feedbacks]);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'employee.user.name',
        Cell: ({ row }) => (
          <Link className='textRedColor' to={`/babysitter-profile/${row.original.babysitterId}`}>
            {row.original.employee.user.name}
          </Link>
        ),
      },
      {
        Header: 'Type',
        accessor: 'employee.type',
      },
      {
        Header: 'Submitted Date',
        accessor: 'feedbackSubmittedDate',
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'Rating',
        accessor: 'stars',
        Cell: ({ value }) => renderStarRating(value),
      },      
      
      {
        Header: 'Comment',
        accessor: 'comment',
      },
    ],
    []
  );

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-center'>
        {data.length === 0 ? (
          <div className="text-center mb-3">
            <p className='mt-3'>You've got nothing booked at the moment</p>
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

export default AllFeedback;
