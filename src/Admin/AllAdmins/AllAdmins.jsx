import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function AllAdmins() {
  const [adminsData, setAdminsData] = useState([]);

  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Username', accessor: 'username' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Gender', accessor: 'gender' },
      { Header: 'level', accessor: 'level' },
      { Header: 'Telephone', accessor: 'telNumber' },
      { Header: 'Date Added', accessor: 'dateAdded' },
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

      const response = await axios.get('http://176.119.254.188:8080/admin/getAllAdmins', config);

      if (response && response.data) {
        const admins = response.data;
        setAdminsData(admins);
      }
    } catch (error) {
      console.error('Error fetching data:', error.response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = React.useMemo(
    () =>
      adminsData.map((admin) => ({
        id: admin.user.id,
        username: admin.user.username,
        name: admin.user.name,
        email: admin.user.email,
        gender: admin.user.gender,
        level: admin.level,
        telNumber: admin.user.telNumber,
        dateAdded: admin.user.dateAdded,
      })),
    [adminsData]
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

  return (
    <div className="container mt-4">
         <div className='DetaliedBook'>
        <p className='mt-4 profileTitle'>All Admins</p>
        <p className='small text-secondary fst-normal'>Review the list of All Admins below.</p>
        <hr></hr>
      </div>
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

export default AllAdmins;
