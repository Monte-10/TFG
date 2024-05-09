import React, { useState, useEffect } from 'react';

function AssignOptionToUser() {
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUsersAndOptions = async () => {
      try {
        const usersResponse = await fetch(`${apiUrl}/user/regularusers/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });
        const optionsResponse = await fetch(`${apiUrl}/nutrition/options/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });
        if (!usersResponse.ok || !optionsResponse.ok) throw new Error('Failed to fetch data');
        const usersData = await usersResponse.json();
        const optionsData = await optionsResponse.json();
        setUsers(usersData);
        setOptions(optionsData);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchUsersAndOptions();
  }, [apiUrl]);

  const handleDownloadPdf = async (optionId) => {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`${apiUrl}/nutrition/options/${optionId}/pdf/`, {
        headers: {
            'Authorization': `Token ${authToken}`,
        },
    });

    if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        setPdfDownloadUrl(downloadUrl); // Guardamos la URL para descargar luego
    } else {
        // Manejar el caso de que la respuesta no esté bien
        console.error('Error downloading PDF:', await response.text());
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch(`${apiUrl}/nutrition/assignOption/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
                userId: selectedUser,
                optionId: selectedOption,
                startDate: selectedDate,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to assign option: ${errorText}`);
        }

        const responseData = await response.json();
        setSuccess(true);
        setError('');

        // Suponiendo que el ID de la opción se devuelva bajo una clave 'optionId'
        const optionId = responseData.optionId;
        if (optionId) {
            handleDownloadPdf(optionId);
        } else {
            console.error('Option ID not found in response:', responseData);
            setError('Failed to get the option ID. PDF download is not available.');
        }

    } catch (error) {
        console.error('Error while assigning option:', error);
        setError(`Failed to assign option. Please try again. Error: ${error.toString()}`);
        setSuccess(false);
    }
};
  
  return (
    <div className="container mt-4">
      <h2>Assign Option to User</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {success && (
        <>
          <div className="alert alert-success" role="alert">
            Option assigned successfully!
            {pdfDownloadUrl && (
              <a href={pdfDownloadUrl} download={`assigned_option.pdf`} className="btn btn-success">
                Download PDF
              </a>
            )}
          </div>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="userSelect" className="form-label">User:</label>
          <select className="form-select" id="userSelect" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="optionSelect" className="form-label">Option:</label>
          <select className="form-select" id="optionSelect" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
            <option value="">Select Option</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Start Date:</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Assign Option</button>
      </form>
    </div>
  );
}

export default AssignOptionToUser;
