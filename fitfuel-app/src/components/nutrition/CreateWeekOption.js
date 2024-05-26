import React, { useState, useEffect } from 'react';

function CreateWeekOption() {
  const [name, setName] = useState('');
  const [selectedDayOptions, setSelectedDayOptions] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });
  const [dayOptions, setDayOptions] = useState([]);
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/nutrition/dayoptions/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    })
    .then(response => response.json())
    .then(data => setDayOptions(data))
    .catch(error => {
      console.error('Error fetching day options:', error);
      setError('Failed to fetch day options. Please refresh the page.');
    });
  }, [apiUrl]);

  const handleDayOptionChange = (day, value) => {
    setSelectedDayOptions({ ...selectedDayOptions, [day]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');

    const weekOptionData = {
      name,
      ...Object.keys(selectedDayOptions).reduce((acc, day) => {
        acc[`${day}_option`] = selectedDayOptions[day];
        return acc;
      }, {}),
    };

    console.log("Sending week option data", weekOptionData);

    try {
      const response = await fetch(`${apiUrl}/nutrition/weekoptions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify(weekOptionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Success:', data);
      setOptionCreated(true);
    } catch (error) {
      console.error('Error creating week option:', error.message);
      setError('Failed to create week option. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Week Option</h2>
      {!optionCreated ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="weekOptionName" className="form-label">Week Option Name:</label>
            <input
              type="text"
              className="form-control"
              id="weekOptionName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter the name for the week option"
            />
          </div>
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
            <div key={day} className="mb-3">
              <label htmlFor={`${day}Option`} className="form-label">{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
              <select className="form-select" id={`${day}Option`} value={selectedDayOptions[day]} onChange={(e) => handleDayOptionChange(day, e.target.value)}>
                <option value="">Select Option for {day}</option>
                {dayOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Create Week Option</button>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
        </form>
      ) : (
        <div className="alert alert-success" role="alert">Week Option created successfully!</div>
      )}
    </div>
  );
}

export default CreateWeekOption;
