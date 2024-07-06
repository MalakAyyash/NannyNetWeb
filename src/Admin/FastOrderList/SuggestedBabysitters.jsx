import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const SuggestedBabysitters = () => {
  const { id } = useParams();
  const [availableBabysitters, setAvailableBabysitters] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStars, setSelectedStars] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');

  const fetchAvailableBabysitters = async () => {
    try {
      const token = Cookies.get('jwt');
      if (!token) {
        console.error('Token not found.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };

      const response = await axios.post(`http://176.119.254.188:8080/admin/order/fastOrder/suggest`, { orderId: id }, config);

      if (response && response.data) {
        setAvailableBabysitters(response.data);
      }
    } catch (error) {
      console.error('Error fetching available babysitters:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Unknown error occurred.',
      });
    }
  };

  useEffect(() => {
    fetchAvailableBabysitters();
  }, [id]);

  const handleAssign = async (babysitterId) => {
    try {
      const token = Cookies.get('jwt');
      if (!token) {
        console.error('Token not found.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };

      const completeResponse = await axios.post(`http://176.119.254.188:8080/admin/order/fastOrder/complete`, { employeeId: babysitterId, orderId: id }, config);

      if (completeResponse && completeResponse.data) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Babysitter has been assigned and order completed successfully.',
        });
        fetchAvailableBabysitters(); // refresh the list
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'warning',
          title: 'Already Assigned',
          text: 'The fast order has already been chosen by a babysitter.',
        });
      } else {
        console.error('Error assigning and completing order:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Unknown error occurred.',
        });
      }
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  const handleSelectStars = (stars) => {
    setSelectedStars(stars);
  };

  const handleSelectGender = (gender) => {
    setSelectedGender(gender);
  };

  const cities = Array.from(new Set(availableBabysitters.map(babysitter => babysitter.city)));
  const types = ['Full-Time', 'Part-Time'];
  const genders = ['Male', 'Female', 'Other'];

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'user.id' },
      {
        Header: 'Username',
        accessor: 'user.username',
        Cell: ({ row }) => (
          <Link to={`/admin/BabysitterInfoStatus/${row.original.user.id}`} className="textRedColor">
            {row.original.user.username}
          </Link>
        )
      },
      { Header: 'Email', accessor: 'user.email' },
      { Header: 'Phone', accessor: 'user.telNumber' },
      { Header: 'Gender', accessor: 'user.gender' },
      {
        Header: 'Date Added',
        accessor: 'user.dateAdded',
        Cell: ({ value }) => new Date(value).toLocaleDateString()
      },
      { Header: 'Availability', accessor: 'availability' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'City', accessor: 'city' },
      {
        Header: 'Date of Birth',
        accessor: 'dateOfBirth',
        Cell: ({ value }) => new Date(value).toLocaleDateString()
      },
      {
        Header: 'Stars',
        accessor: 'stars',
        Cell: ({ value }) => value.toFixed(2)
      },
      { Header: '#Canceles', accessor: 'numOfCancelation' },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <button className="btn rounded-0 BlueColor text-light me-2" onClick={() => handleAssign(row.original.user.id)}>
            Assign
          </button>
        )
      }
    ],
    []
  );

  const data = useMemo(() => availableBabysitters, [availableBabysitters]);

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
      initialState: { pageIndex: 0, pageSize: 5 } // Adjust pageSize as per your requirement
    },
    useSortBy,
    usePagination
  );

  // Filter the babysitters based on the selected criteria
  const filteredBabysitters = useMemo(() => {
    return availableBabysitters.filter(babysitter => {
      return (
        (selectedCity === '' || babysitter.city === selectedCity) &&
        (selectedType === '' || babysitter.type === selectedType) &&
        (selectedStars === null || babysitter.stars >= selectedStars) &&
        (selectedGender === '' || babysitter.user.gender === selectedGender)
      );
    });
  }, [availableBabysitters, selectedCity, selectedType, selectedStars, selectedGender]);

  return (
    <div className="container mt-4">
      <div className='DetaliedBook'>
        <p className='mt-4 profileTitle'>Suggested Babysitters</p>
      </div>
      <div className="row border-top mb-4">
        <div className="col-md-1">
          <p className="pt-2 text">Filter by:</p>
        </div>
        <div className="dropdown col-md-2 border-left">
          <a
            className="btn btn-secondary border-0 dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Location ({selectedCity || 'All'})
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleCitySelect('')}>
                All
              </button>
            </li>
            {cities.map((city) => (
              <li key={city}>
                <button className="dropdown-item" onClick={() => handleCitySelect(city)}>
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="dropdown col-md-2">
          <a
            className="btn btn-secondary dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Type ({selectedType || 'All'})
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleSelectType('')}>
                All
              </button>
            </li>
            {types.map((type) => (
              <li key={type}>
                <button className="dropdown-item" onClick={() => handleSelectType(type)}>
                  {type}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="dropdown col-md-2">
          <a
            className="btn btn-secondary dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Stars ({selectedStars !== null ? `${selectedStars}+` : 'All'})
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleSelectStars(null)}>
                All
              </button>
            </li>
            {[1, 2, 3, 4, 5].map((stars) => (
              <li key={stars}>
                <button className="dropdown-item" onClick={() => handleSelectStars(stars)}>
                  {stars}+
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="dropdown col-md-2">
          <a
            className="btn btn-secondary dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Gender ({selectedGender || 'All'})
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleSelectGender('')}>
                All
              </button>
            </li>
            {genders.map((gender) => (
              <li key={gender}>
                <button className="dropdown-item" onClick={() => handleSelectGender(gender)}>
                  {gender}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='d-flex justify-content-center'>
        <table className="table table-striped" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
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
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()} className="text-center">
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
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
};

export default SuggestedBabysitters;
