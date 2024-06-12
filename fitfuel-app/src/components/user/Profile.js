import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';

const Profile = () => {
    const [profile, setProfile] = useState({
        bio: '',
        age: '',
        gender: 'male',
        image: null,
        specialties: [],
        trainer_type: 'trainer'
    });
    const [regularUser, setRegularUser] = useState({
        weight: '',
        height: '',
        neck: '',
        shoulder: '',
        chest: '',
        waist: '',
        hip: '',
        arm: '',
        glute: '',
        upper_leg: '',
        middle_leg: '',
        lower_leg: '',
        communication_email: '',
        phone: ''
    });
    const [specialties, setSpecialties] = useState([]);
    const [isTrainer, setIsTrainer] = useState(false);
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
                const { profile: profileData = {}, trainer = {}, regular_user = {} } = response.data;

                setProfile({
                    bio: profileData.bio || '',
                    age: profileData.age || '',
                    gender: profileData.gender || 'male',
                    image: profileData.image || null,
                    specialties: trainer.specialties || [],
                    trainer_type: trainer.trainer_type || 'trainer'
                });

                setRegularUser({
                    weight: regular_user.weight || '',
                    height: regular_user.height || '',
                    neck: regular_user.neck || '',
                    shoulder: regular_user.shoulder || '',
                    chest: regular_user.chest || '',
                    waist: regular_user.waist || '',
                    hip: regular_user.hip || '',
                    arm: regular_user.arm || '',
                    glute: regular_user.glute || '',
                    upper_leg: regular_user.upper_leg || '',
                    middle_leg: regular_user.middle_leg || '',
                    lower_leg: regular_user.lower_leg || '',
                    communication_email: regular_user.communication_email || '',
                    phone: regular_user.phone || ''
                });

                setIsTrainer(!!trainer.specialties?.length);
            } catch (error) {
                setError("Error al cargar el perfil");
                console.error("Error al cargar el perfil:", error.response?.data || error.message);
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
                console.error("Error al cargar especialidades:", error.response?.data || error.message);
            }
        };

        fetchProfile();
        fetchSpecialties();
    }, [apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const handleRegularUserChange = (e) => {
        const { name, value } = e.target;
        setRegularUser(prevRegularUser => ({ ...prevRegularUser, [name]: value }));
    };

    const handleSpecialtyChange = (e) => {
        const { value, checked } = e.target;
        setProfile(prevProfile => {
            const newSpecialties = checked
                ? [...prevProfile.specialties, parseInt(value)]
                : prevProfile.specialties.filter(specialty => specialty !== parseInt(value));
            return { ...prevProfile, specialties: newSpecialties };
        });
    };

    const handleImageChange = (e) => {
        setProfile(prevProfile => ({ ...prevProfile, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('bio', profile.bio);
        formData.append('age', profile.age);
        formData.append('gender', profile.gender);
        if (profile.image instanceof File) {
            formData.append('image', profile.image);
        }

        if (isTrainer) {
            formData.append('trainer_type', profile.trainer_type);
            formData.append('specialties', JSON.stringify(profile.specialties));
            formData.append('communication_email', profile.communication_email);
            formData.append('phone', profile.phone);
        } else {
            Object.keys(regularUser).forEach(key => {
                formData.append(key, regularUser[key]);
            });
        }

        try {
            const response = await axios.put(`${apiUrl}/user/profile/`, formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { profile: updatedProfileData = {}, trainer: updatedTrainerData = {}, regular_user: updatedRegularUserData = {} } = response.data;

            setProfile({
                bio: updatedProfileData.bio || '',
                age: updatedProfileData.age || '',
                gender: updatedProfileData.gender || 'male',
                image: updatedProfileData.image || null,
                specialties: updatedTrainerData ? updatedTrainerData.specialties : [],
                trainer_type: updatedTrainerData ? updatedTrainerData.trainer_type : 'trainer'
            });

            setRegularUser({
                weight: updatedRegularUserData.weight || '',
                height: updatedRegularUserData.height || '',
                neck: updatedRegularUserData.neck || '',
                shoulder: updatedRegularUserData.shoulder || '',
                chest: updatedRegularUserData.chest || '',
                waist: updatedRegularUserData.waist || '',
                hip: updatedRegularUserData.hip || '',
                arm: updatedRegularUserData.arm || '',
                glute: updatedRegularUserData.glute || '',
                upper_leg: updatedRegularUserData.upper_leg || '',
                middle_leg: updatedRegularUserData.middle_leg || '',
                lower_leg: updatedRegularUserData.lower_leg || '',
                communication_email: updatedRegularUserData.communication_email || '',
                phone: updatedRegularUserData.phone || ''
            });

        } catch (error) {
            setError(`Error al actualizar el perfil: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            console.error("Error al actualizar el perfil:", error.response?.data || error.message);
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
                        value={profile.bio}
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
                        value={profile.age}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="gender" className="form-label">Género</label>
                    <select
                        id="gender"
                        name="gender"
                        className="form-select"
                        value={profile.gender}
                        onChange={handleChange}
                    >
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                {isTrainer ? (
                    <>
                        <div className="mb-3">
                            <label htmlFor="trainer_type" className="form-label">Tipo de Entrenador</label>
                            <select
                                id="trainer_type"
                                name="trainer_type"
                                className="form-select"
                                value={profile.trainer_type}
                                onChange={handleChange}
                            >
                                <option value="trainer">Entrenador</option>
                                <option value="nutritionist">Nutricionista</option>
                                <option value="both">Entrenador y Nutricionista</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Especialidades</label>
                            {specialties.map(specialty => (
                                <div key={specialty.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`specialty-${specialty.id}`}
                                        value={specialty.id}
                                        checked={profile.specialties.includes(specialty.id)}
                                        onChange={handleSpecialtyChange}
                                    />
                                    <label className="form-check-label" htmlFor={`specialty-${specialty.id}`}>
                                        {specialty.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <Container>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="weight" className="form-label">Peso</label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        className="form-control"
                                        value={regularUser.weight}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="height" className="form-label">Altura</label>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        className="form-control"
                                        value={regularUser.height}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="neck" className="form-label">Cuello</label>
                                    <input
                                        type="number"
                                        id="neck"
                                        name="neck"
                                        className="form-control"
                                        value={regularUser.neck}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="shoulder" className="form-label">Hombro</label>
                                    <input
                                        type="number"
                                        id="shoulder"
                                        name="shoulder"
                                        className="form-control"
                                        value={regularUser.shoulder}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="chest" className="form-label">Pecho</label>
                                    <input
                                        type="number"
                                        id="chest"
                                        name="chest"
                                        className="form-control"
                                        value={regularUser.chest}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="waist" className="form-label">Cintura</label>
                                    <input
                                        type="number"
                                        id="waist"
                                        name="waist"
                                        className="form-control"
                                        value={regularUser.waist}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="hip" className="form-label">Cadera</label>
                                    <input
                                        type="number"
                                        id="hip"
                                        name="hip"
                                        className="form-control"
                                        value={regularUser.hip}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="arm" className="form-label">Brazo</label>
                                    <input
                                        type="number"
                                        id="arm"
                                        name="arm"
                                        className="form-control"
                                        value={regularUser.arm}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="glute" className="form-label">Glúteo</label>
                                    <input
                                        type="number"
                                        id="glute"
                                        name="glute"
                                        className="form-control"
                                        value={regularUser.glute}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="upper_leg" className="form-label">Pierna Superior</label>
                                    <input
                                        type="number"
                                        id="upper_leg"
                                        name="upper_leg"
                                        className="form-control"
                                        value={regularUser.upper_leg}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="middle_leg" className="form-label">Pierna Media</label>
                                    <input
                                        type="number"
                                        id="middle_leg"
                                        name="middle_leg"
                                        className="form-control"
                                        value={regularUser.middle_leg}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="lower_leg" className="form-label">Pierna Inferior</label>
                                    <input
                                        type="number"
                                        id="lower_leg"
                                        name="lower_leg"
                                        className="form-control"
                                        value={regularUser.lower_leg}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="communication_email" className="form-label">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        id="communication_email"
                                        name="communication_email"
                                        className="form-control"
                                        value={regularUser.communication_email}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        className="form-control"
                                        value={regularUser.phone}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                )}
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
