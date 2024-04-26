import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import Swal from 'sweetalert2';

function HistoryOrders() {
  const [userData, setUserData] = useState([]);

  const columns = React.useMemo(
    () => [
      { Header: 'User ID', accessor: 'id' },
      { Header: 'Username', accessor: 'username' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Phone Number', accessor: 'telNumber' },
    ],
    []
  );

  const fetchData = async () => {
    try {
      const response = await axios.get('http://176.119.254.188:8080/admin/getAllusers');

      if (response && response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const data = React.useMemo(() => userData, [userData]);

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
        {data.length === 0 ? ( // Check if data array is empty
          <div className="text-center mb-3">
            <p className='mt-3'>No users found.</p>
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

export default HistoryOrders;
