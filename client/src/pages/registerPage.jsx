import React from 'react';
import {Redirect} from 'react-router-dom';
import Register from '../components/Register'
import ErrorMessage from '../components/errorMessage';

const RegisterPage = ({authType, isAuthenticated}) => {
    if (isAuthenticated) return <Redirect to="/" />

    return (
        <div >
            <ErrorMessage/>
            <Register authType={authType}/>
        </div>
    )
};

export default RegisterPage;