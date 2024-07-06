import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function ViewBlog() {
  const [blogsData, setBlogsData] = useState([]);

  const columns = React.useMemo(
    () => [
      { Header: 'Blog ID', accessor: 'id' },
      {
        Header: 'Username',
        accessor: 'user.username',
        Cell: ({ value }) => (value ? value : 'Anonymous'),
      },
      {
        Header: 'Email',
        accessor: 'user.email',
        Cell: ({ value }) => (value ? value : 'Anonymous'),
      },
      {
        Header: 'Phone',
        accessor: 'user.telNumber',
        Cell: ({ value }) => (value ? value : 'Anonymous'),
      },
      { Header: 'Comment', accessor: 'comment' },
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

      const response = await axios.get('http://176.119.254.188:8080/admin/blog/get/all', config);

      if (response.status === 200) {
        setBlogsData(response.data);
      } else {
        throw new Error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch blogs. Please try again later.',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = React.useMemo(() => blogsData, [blogsData]);

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
        <p className='mt-4 fst-normal'>View Blogs</p>
      </div>
      <p className='small text-secondary fst-normal'>Review the list of all blogs below.</p>
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

export default ViewBlog;
