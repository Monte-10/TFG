import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AssignOptionToUser() {
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch users and options
    const fetchUsersAndOptions = async () => {
      // Example fetches, adapt URLs and logic as needed
      try {
        const usersRes = await fetch('http://127.0.0.1:8000/user/regularusers/', {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
        });
        const optionsRes = await fetch('http://127.0.0.1:8000/nutrition/options/', {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
        });
        if (!usersRes.ok || !optionsRes.ok) throw new Error('Failed to fetch data');

        const usersData = await usersRes.json();
        const optionsData = await optionsRes.json();
        setUsers(usersData);
        setOptions(optionsData);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Fetch error:', error);
      }
    };

    fetchUsersAndOptions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Submit selected option for user, adjust endpoint and request body as needed
    try {
      const response = await fetch('http://127.0.0.1:8000/user/assignOption/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ userId: selectedUser, optionId: selectedOption }),
      });
      if (!response.ok) throw new Error('Failed to assign option');

      // Navigate to a success page or show success message
      navigate('/successPage');
    } catch (error) {
      setError('Failed to assign option. Please try again.');
      console.error('Assignment error:', error);
    }
  };

  return (
    <div>
      <h2>Assign Option to User</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          User:
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </label>
        <label>
          Option:
          <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
            {options.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">Assign Option</button>
      </form>
    </div>
  );
}

export default AssignOptionToUser;
