import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function PendingBabysitters() {
  const [babysittersData, setBabysittersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Username', accessor: 'username' },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }) => (
          <Link className='textRedColor' to={`/babysitter-profile/${row.original.id}`}>
            {row.original.name}
          </Link>
        ),
      },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Gender', accessor: 'gender' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'City', accessor: 'city' },
      { Header: 'Phone', accessor: 'telNumber' },
      { Header: 'Date of Birth', accessor: 'dateOfBirth' },
      { Header: 'Stars', accessor: 'stars' },
      { Header: '#Cancellations', accessor: 'numOfCancellation' }, // corrected accessor name
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div className="d-flex flex-column align-items-center">
            <button className="btn btn-success me-2 mb-1" onClick={() => handleAccept(row.original.id)}>
              Accept
            </button>
            <button className="btn btn-danger d-flex me-2" onClick={() => handleReject(row.original.id)}>
              Reject
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
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://176.119.254.188:8080/admin/getSigned', config);

      if (response && response.data) {
        const babysitters = response.data;
        setBabysittersData(babysitters);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error.response.data);
      setLoading(false);
    }
  };

  const handleAccept = async (babysitterId) => {
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

      const response = await axios.get(`http://176.119.254.188:8080/admin/addEmployee/${babysitterId}`, config);

      if (response && response.data) {
        Swal.fire('Babysitter accepted!', 'This babysitter has been accepted.', 'success');
        fetchData();
      }
    } catch (error) {
      console.error('Error accepting babysitter:', error.response.data);
      Swal.fire('Error', 'Failed to accept babysitter.', 'error');
    }
  };

  const handleReject = async (babysitterId) => {
    // Implement rejection logic if needed
    console.log(`Rejecting babysitter with ID: ${babysitterId}`);
    // You can add custom rejection logic here
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (babysittersData.length === 0) {
    return (
      <>
    
      <div className='DetaliedBook'>
        <p className='mt-4 fst-normal '>Pending Babysitters</p>
        </div>
        <p className='small text-secondary fst-normal'>Review the list of pending babysitters below. Click "Accept" to confirm a babysitter.</p>
        <hr></hr>
        <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <p className=''>There Is No Pending Babysitters To Show.</p>
        </div>
        </>
    );
  }

  return (
    <div className="container mt-4">
        <div className='DetaliedBook'>
        <p className='mt-4 fst-normal'>All Babysitters</p>
      </div>
      <p className='small text-secondary fst-normal'>Review the list of All babysitters below.</p>
      <hr></hr>
      <div className='d-flex justify-content-center ps-5'>
        <table {...getTableProps()} className="table table-striped">
          {/* Render table headers */}
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
          {/* Render table body */}
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
      {/* Pagination controls */}
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

export default PendingBabysitters;
