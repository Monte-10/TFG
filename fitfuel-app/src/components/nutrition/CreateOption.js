import React, { useState, useEffect } from 'react';

function CreateOption() {
  const [name, setName] = useState('');
  const [weekOptions, setWeekOptions] = useState([]);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState('');
  const [selectedWeekOptions, setSelectedWeekOptions] = useState({
    week_option_one: '',
    week_option_two: '',
    week_option_three: '',
  });
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/nutrition/weekoptions/', {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    })
    .then(response => response.json())
    .then(data => setWeekOptions(data))
    .catch(error => {
      console.error('Error fetching week options:', error);
      setError('Failed to fetch week options. Please refresh the page.');
    });
  }, []);

  const handleWeekOptionChange = (weekOptionType, value) => {
    setSelectedWeekOptions({ ...selectedWeekOptions, [weekOptionType]: value });
  };

  const handleDownloadPdf = async (optionId) => {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://127.0.0.1:8000/nutrition/options/${optionId}/pdf/`, {
      headers: {
        'Authorization': `Token ${authToken}`,
      },
    });
  
    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${name}_option.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } else {
      // Manejar el caso de que la respuesta no esté bien
      console.error('Error downloading PDF:', await response.text());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');

    const optionData = {
      name,
      ...selectedWeekOptions,
    };

    console.log("Sending option data", optionData);

    try {
      const response = await fetch('http://127.0.0.1:8000/nutrition/options/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify(optionData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      const data = await response.json();
      console.log('Success:', data);
      setOptionCreated(true);
  
      // Aquí llamamos a la función para manejar la descarga del PDF
      handleDownloadPdf(data.id);
    } catch (error) {
      console.error('Error creating option:', error);
      setError(`Failed to create option. Please try again. Error: ${error.toString()}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Option</h2>
      {!optionCreated ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="optionName" className="form-label">Option Name:</label>
            <input
              type="text"
              className="form-control"
              id="optionName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter the option name"
            />
          </div>
          {['week_option_one', 'week_option_two', 'week_option_three'].map((weekOptionType, index) => (
            <div key={weekOptionType} className="mb-3">
              <label htmlFor={`${weekOptionType}Select`} className="form-label">Week Option {index + 1}:</label>
              <select className="form-select" id={`${weekOptionType}Select`} value={selectedWeekOptions[weekOptionType]} onChange={(e) => handleWeekOptionChange(weekOptionType, e.target.value)}>
                <option value="">Select Week Option {index + 1}</option>
                {weekOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Create Option</button>
        </form>
      ) : (
        <>
          <div className="alert alert-success" role="alert">
            Option created successfully!
            {/* Opcional: Agregar botón para descargar PDF */}
            {pdfDownloadUrl && (
              <a href={pdfDownloadUrl} download={`${name}_option.pdf`} className="btn btn-success">
                Download PDF
              </a>
            )}
          </div>
        </>
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
    </div>
  );
}

export default CreateOption;
