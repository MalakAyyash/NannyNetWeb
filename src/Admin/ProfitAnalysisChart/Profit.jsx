import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import ProfitAnalysisChart from '../ProfitAnalysisChart/ProfitAnalysisChart';

function Profit() {
    const [chartInstance, setChartInstance] = useState(null);

    // Static data for demonstration
    const data = useMemo(
        () => [
            { month: 'January', profit: 500 },
            { month: 'February', profit: 600 },
            { month: 'March', profit: 300 },
            { month: 'April', profit: 800 },
            { month: 'May', profit: 500 },
            { month: 'June', profit: 2000 },
            // Add more months as needed
        ],
        []
    );

    const columns = useMemo(
        () => [
            { Header: 'Month', accessor: 'month' },
            { Header: 'Profit ($)', accessor: 'profit', Cell: ({ value }) => parseFloat(value).toFixed(2) },
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
        nextPage,
        previousPage,
        pageOptions,
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 7 },
        },
        useSortBy,
        usePagination
    );

    useEffect(() => {
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [chartInstance]);

    const handleChartRef = (chart) => {
        setChartInstance(chart);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6 mt-3">
                    <div className="DetaliedBook">
                        <p className="mt-4 fst-normal"></p>
                    </div>
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
                    <div className="d-flex justify-content-center mt-4">
                        <button disabled={!canPreviousPage} onClick={() => previousPage()}>
                            Previous Page
                        </button>
                        <button disabled={!canNextPage} onClick={() => nextPage()}>
                            Next Page
                        </button>
                    </div>
                    <div className="text-light text-center">
                        Page {pageIndex + 1} of {pageOptions.length}
                    </div>
                </div>
                <div className="col-md-6">
                    <ProfitAnalysisChart ref={handleChartRef} />
                </div>
            </div>
        </div>
    );
}

export default Profit;
