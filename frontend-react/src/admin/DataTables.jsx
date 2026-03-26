import React, { useEffect, useState } from 'react';

const DataTables = ({ endpoint }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/api/${endpoint}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [endpoint]);

  if (loading) return <div className="loading-spinner">Loading {endpoint}...</div>;
  if (error) return <div className="error-message">Error loading data: {error}</div>;

  return (
    <div className="data-table-container style-table">
      <h3>Manage {endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}</h3>
      {data.length === 0 ? (
        <p>No records found in database.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              {Object.keys(data[0])
                .filter(key => key !== '__v' && key !== 'createdAt' && key !== 'updatedAt')
                .map(key => (
                  <th key={key}>{key.toUpperCase()}</th>
              ))}
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id || index}>
                {Object.entries(item)
                  .filter(([key]) => key !== '__v' && key !== 'createdAt' && key !== 'updatedAt')
                  .map(([key, value]) => (
                    <td key={key}>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value).substring(0, 30)}
                      {String(value).length > 30 ? '...' : ''}
                    </td>
                ))}
                <td>
                  <button className="btn-edit"><i className="fas fa-edit"></i> Edit</button>
                  <button className="btn-delete"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="add-new-container">
        <button className="btn-add-new">+ Add New Record</button>
      </div>
    </div>
  );
};

export default DataTables;
