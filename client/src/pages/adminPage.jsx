import React from 'react';


import Admin from '../components/Admin';
import ErrorMessage from '../components/errorMessage';

const AdminPage = ( props) => {

  return (
    <div>
      <ErrorMessage />
      <Admin {...props} />
    </div>
  );
};

export default AdminPage;
