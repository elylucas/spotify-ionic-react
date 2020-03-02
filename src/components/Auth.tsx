import React, { useEffect } from 'react';
import { Redirect } from 'react-router';

interface AuthProps {
  onUpdateToken: (token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onUpdateToken }) => {

  useEffect(() => {
    const token = window.location.hash.replace('#', '').split('&')[0].replace('access_token=', '');
    if (token) {
      onUpdateToken(token);
    }
  }, []);

  return null;
};

export default Auth;