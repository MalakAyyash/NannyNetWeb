import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useParams } from 'react-router-dom';
import { FaCaretSquareDown, FaCaretSquareUp } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const CustomerFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const { id } = useParams(); // Get the ID parameter from the URL

  useEffect(() => {
    const fetchFeedbackData = async () => {
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
          'http://176.119.254.188:8080/admin/feedback/get/customer',
          { customerId: id },
          config
        );

        if (response && response.data) {
          setFeedbackData(response.data);
        }
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchFeedbackData();
  }, [id]);

  const renderStarRating = (stars) => {
    const starElements = [];
    for (let i = 1; i <= 5; i++) {
      starElements.push(
        <i
          key={i}
          className={`fa ${i <= stars ? 'fa-star text-warning' : 'fa-star text-secondary'}`}
        ></i>
      );
    }
    return starElements;
  };

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'employee.user.id' },
      { Header: 'Babysitter Name', accessor: 'employee.user.username' },
      { Header: 'Feedback Text', accessor: 'comment', Cell: ({ value }) => <div className='feedback-text-container'>{value}</div> },
      { Header: 'Stars', accessor: 'stars', Cell: ({ value }) => renderStarRating(value) },
      { Header: 'Feedback Date', accessor: 'feedbackSubmittedDate' },
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
      data: feedbackData,
      initialState: { pageIndex: 0, pageSize: 2 }, // Set initial page index and page size
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="container mt-4">
      <div className="text-end">
        <Link to={`/Admin/AllFeedback/${id}`} className='textRedColor'>See All</Link>
      </div>
      <div className="d-flex justify-content-center">
        {feedbackData.length === 0 ? (
          <div className="text-center mb-3">
            <p className="mt-3">No feedback available.</p>
          </div>
        ) : (
          <table {...getTableProps()} className="table table-striped">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className="table-header">
                      <div className="d-flex justify-content-center align-items-center">
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
      {feedbackData.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <button disabled={!canPreviousPage} onClick={() => previousPage()}>
            Previous Page
          </button>
          <button disabled={!canNextPage} onClick={() => nextPage()}>
            Next Page
          </button>
        </div>
      )}
      {feedbackData.length > 0 && (
        <div className="d-flex justify-content-center mt-2">
          <span className="text-light">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default CustomerFeedback;
