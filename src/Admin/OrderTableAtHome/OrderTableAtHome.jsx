import React from 'react';

const OrderTableAtHome = () => {
  const dummyOrders = [
    { id: 1, babysitterId: 'B001', customerId: 'C001', beginDate: '2024-03-01', endDate: '2024-03-05', status: 'Completed' },
    { id: 2, babysitterId: 'B002', customerId: 'C002', beginDate: '2024-03-02', endDate: '2024-03-06', status: 'Cancelled' },
    { id: 3, babysitterId: 'B003', customerId: 'C003', beginDate: '2024-03-03', endDate: '2024-03-07', status: 'Completed' },
    // Add more dummy orders as needed
  ];

  return (
    <div className="">
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Order ID</th>
          <th scope="col">Babysitter ID</th>
          <th scope="col">Customer ID</th>
          <th scope="col">Begin Date</th>
          <th scope="col">End Date</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {dummyOrders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.babysitterId}</td>
            <td>{order.customerId}</td>
            <td>{order.beginDate}</td>
            <td>{order.endDate}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default OrderTableAtHome;
