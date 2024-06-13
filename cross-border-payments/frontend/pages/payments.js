import React, { useState, useEffect } from 'eact';
import axios from 'axios';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('/api/payments');
        const paymentsData = response.data;
        setPayments(paymentsData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Payments</h2>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            {payment.date} - {payment.amount} {payment.currency}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;