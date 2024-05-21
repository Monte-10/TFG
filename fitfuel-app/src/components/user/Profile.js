import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [specialties, setSpecialties] = useState([]);
    const [error, setError] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/profile/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                setProfile(response.data);
            } catch (error) {
                setError("Error al cargar el perfil");
            }
        };

        const fetchSpecialties = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/specialties/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                setSpecialties(response.data);
            } catch (error) {
                setError("Error al cargar especialidades");
            }
        };

        fetchProfile();
        fetchSpecialties();
    }, [apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const handleSpecialtyChange = (e) => {
        const { value, checked } = e.target;
        setProfile(prevProfile => {
            const newSpecialties = checked
                ? [...prevProfile.specialties, value]
                : prevProfile.specialties.filter(specialty => specialty !== value);
            return { ...prevProfile, specialties: newSpecialties };
        });
    };

    const handleImageChange = (e) => {
        setProfile(prevProfile => ({ ...prevProfile, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            if (key === 'specialties') {
                profile[key].forEach(specialty => formData.append(key, specialty));
            } else {
                formData.append(key, profile[key]);
            }
        });

        try {
            const response = await axios.put(`${apiUrl}/user/profile/`, formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProfile(response.data);
        } catch (error) {
            setError("Error al actualizar el perfil");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Perfil</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Biografía</label>
                    <textarea
                        id="bio"
                        name="bio"
                        className="form-control"
                        value={profile.bio || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">Edad</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        className="form-control"
                        value={profile.age || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="gender" className="form-label">Género</label>
                    <select
                        id="gender"
                        name="gender"
                        className="form-select"
                        value={profile.gender || ''}
                        onChange={handleChange}
                    >
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="trainerType" className="form-label">Tipo de Entrenador</label>
                    <select
                        id="trainerType"
                        name="trainerType"
                        className="form-select"
                        value={profile.trainerType || ''}
                        onChange={handleChange}
                    >
                        <option value="trainer">Entrenador</option>
                        <option value="nutritionist">Nutricionista</option>
                        <option value="both">Entrenador y Nutricionista</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="specialties" className="form-label">Especialidades</label>
                    <div id="specialties">
                        {specialties.map((specialty) => (
                            <div key={specialty.id} className="form-check">
                                <input
                                    type="checkbox"
                                    id={`specialty-${specialty.id}`}
                                    name="specialties"
                                    value={specialty.id}
                                    className="form-check-input"
                                    checked={profile.specialties?.includes(specialty.id) || false}
                                    onChange={handleSpecialtyChange}
                                />
                                <label htmlFor={`specialty-${specialty.id}`} className="form-check-label">
                                    {specialty.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Imagen de Perfil</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        className="form-control"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default Profile;
