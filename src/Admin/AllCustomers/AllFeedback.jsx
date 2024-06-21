import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareDown, FaCaretSquareUp } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

function AllFeedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const { id } = useParams(); // Get the ID parameter from the URL

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
      { Header: 'Babysitter ID', accessor: 'employee.user.id' },
      { Header: 'Babysitter Username', accessor: 'employee.user.username' },
      { Header: 'Comment', accessor: 'comment' },
      { Header: 'Stars', accessor: 'stars', Cell: ({ value }) => renderStarRating(value) },
      { Header: 'Feedback Date', accessor: 'feedbackSubmittedDate' },
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

      const response = await axios.post(
        'http://176.119.254.188:8080/admin/feedback/get/customer',
        { customerId: id },
        config
      );
      if (response && response.data) {
        const feedback = response.data;

        setFeedbackData(feedback);
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error);
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

  const data = useMemo(() => feedbackData, [feedbackData]);

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
        <p className='mt-4 profileTitle'>All Feedback</p>
        <p className='small text-secondary fst-normal'>Review all feedback below.</p>
        <hr></hr>
      </div>
      <div className="d-flex justify-content-center">
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

export default AllFeedback;
