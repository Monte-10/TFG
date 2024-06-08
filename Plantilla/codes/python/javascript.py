'''
function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch(`
                ${apiUrl}/user/frontlogin/`, {
                method: 'POST',
                headers: {
            'Authorization': `Token {localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.detail || 'Falló inicio de sesión');
            }

            const { token, userId } = await response.json();
            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', userId);
            onLoginSuccess(token, userId);
            navigate('dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

///////////////////////////

function CreateDiet() {
    ...
    useEffect(() => {
      fetch(`${apiUrl}/user/regularusers/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setUsers(data);
          if (data.length > 0) {
            setSelectedUser(data[0].id.toString());
          }
        });
    }, [apiUrl]);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const dietData = {
        name,
        user: selectedUser,
        start_date: startDate,
        end_date: endDate,
      };
      console.log("Sending diet data", dietData);
      fetch(`${apiUrl}/nutrition/diet/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(dietData),
      })
      ...

///////////////////////////

return (
    <div className="container mt-5">
        <h2 className="mb-4">Crear Nueva Dieta</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name" 
            className="form-label">Nombre de la Dieta:</label>
            <input type="text" 
            className="form-control" id="name" value={name} 
            onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
            <label htmlFor="userSelect" 
            className="form-label">Usuario:</label>
            <select className="form-select" id="userSelect" 
            value={selectedUser} onChange={
                e => setSelectedUser(e.target.value)}
             required>
            <option value="">Seleccione un usuario</option>
            {users.map(user => (
                <option key={user.id} 
                value={user.id}>{user.username}</option>
            ))}
            </select>
        </div>
        <div className="mb-3">
            <label htmlFor="startDate" 
            className="form-label">Fecha de Inicio:</label>
            <input type="date" className="form-control" id="startDate" 
            value={startDate} onChange={e => setStartDate(e.target.value)}
             required />
        </div>
        ...
        <button type="submit" className="btn btn-primary">
        Crear Dieta</button>
        </form>
    </div>);}
export default CreateDiet;

///////////////////////////

const apiUrl = process.env.REACT_APP_API_URL;

        export const getTrainingPlans = async () => {
            const response = await fetch(`${apiUrl}/sport/trainings/`,{
                headers: {
                  'Authorization': `Token ${
                    localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            return data;
        };

///////////////////////////

import { API_URL } from '../config';
        export const fetchTrainingPlans = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/training-plans/`);
                if (!response.ok) throw new Error(
                    'Network response was not ok');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching training plans:', error);
                return [];
            }
        };

///////////////////////////

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="TrainingDetailsScreen" 
            component={TrainingDetailsScreen} />
    </Stack.Navigator>
    );
}
export default AppNavigator;

///////////////////////////

const DetailsScreen = ({ route }) => {
    const { date, dietEvents, trainingEvents } = route.params;
    return (
        ...
        <Text style={styles.subtitle}>Entrenamientos:</Text>
        {trainingEvents && trainingEvents.length > 0 ? (
            trainingEvents.map((training, index) => (
            <View key={index} style={styles.section}>
                <Text style={styles.sectionTitle}>{training.name}</Text>
                {training.exercises_details.map((detail, idx) => (
                <Text key={idx} style={styles.itemText}>
                    {detail.exercise.name} - 
                    Series: {detail.sets}, ...
                    {detail.weight && `, Peso: ${detail.weight}kg`}
                    {detail.time && `, Tiempo: ${detail.time}min`}
                </Text>))}</View>))
        ) : (
            <Text style={styles.noDataText}>
            No hay entrenamientos para este día.</Text>
        )}
        <Text style={styles.subtitle}>Detalles de la Dieta Diaria:</Text>
        {dietEvents && dietEvents.length > 0 ? (
            ...
                <Text style={styles.sectionTitle}>Nutrientes:</Text>
                ...
                <Text style={styles.sectionTitle}>Comidas:</Text>
                {diet.mealsDetails && diet.mealsDetails.length > 0 ? (
                diet.mealsDetails.map((meal, mealIndex) => (
                    <Text key={mealIndex} style={styles.itemText}>
                    {meal.name}</Text>
                ))
                ) : (
                <Text style={styles.noDataText}>No hay ...</Text>
                )}
            </View>
        ...

///////////////////////////

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from './Login';

test('renders Login component', () => {
    const { getByLabelText, getByText } = render(<Login />);
    const usernameInput = getByLabelText(/username/i);
    const passwordInput = getByLabelText(/password/i);
    const loginButton = getByText(/login/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
});

test('allows the user to log in', () => {
    const { getByLabelText, getByText } = render(<Login />);
    const usernameInput = getByLabelText(/username/i);
    const passwordInput = getByLabelText(/password/i);
    const loginButton = getByText(/login/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
        });

///////////////////////////

import React from 'react';
import { render } from '@testing-library/react';
import HomePage from './HomePage';

test('renders HomePage component', () => {
    const { getByText } = render(<HomePage />);
    const linkElement = getByText(/Welcome to HomePage/i);
    expect(linkElement).toBeInTheDocument();
});

///////////////////////////

import React from 'react';
import { render } from '@testing-library/react';
import Profile from './Profile';

test('renders Profile component', () => {
    const { getByText } = render(<Profile />);
    const headingElement = getByText(/Profile/i);
    expect(headingElement).toBeInTheDocument();
});

///////////////////////////

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginScreen from './LoginScreen';
import AuthContext from '../AuthContext';

const mockLogin = jest.fn();

describe('LoginScreen', () => {
    test('renders LoginScreen and performs login', () => {
    render(
        <AuthContext.Provider value={{ login: mockLogin }}>
        <LoginScreen />
        </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
});

///////////////////////////

import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
    test('renders HomeScreen with welcome message', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Welcome to the Home Screen')).toBeInTheDocument();
    });
});
'''