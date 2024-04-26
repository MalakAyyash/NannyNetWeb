import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get('http://your-api-url/feedback'); // Replace with your API endpoint for fetching feedback data
        if (response && response.data) {
          setFeedbackData(response.data);
        }
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchFeedbackData();
  }, []);

  return (
    <div className="customer-feedback-table">
      <table className="table">
        <thead>
          <tr>
            <th>Feedback ID</th>
            <th>Babysitter ID</th>
            <th>Babysitter Name</th>
            <th>Feedback Text</th>
          </tr>
        </thead>
        <tbody>
          {feedbackData.map((feedback) => (
            <React.Fragment key={feedback.id}>
              <tr>
                <td>{feedback.id}</td>
                <td>{feedback.babysitter.id}</td>
                <td>{feedback.babysitter.name}</td>
                <td>{feedback.text}</td>

              </tr>
              {feedback.replies && feedback.replies.length > 0 && (
                <tr>
                  <td colSpan="4">
                    <table className="table nested-table">
                      <tbody>
                        {feedback.replies.map((reply) => (
                          <tr key={reply.id}>
                            <td>{reply.id}</td>
                            <td colSpan="3">{reply.text}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerFeedback;
