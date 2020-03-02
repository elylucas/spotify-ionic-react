import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import StateContext from './components/StateContext';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Tabs from './components/Tabs';
import Login from './pages/Login';
import Auth from './components/Auth';

const App: React.FC = () => {

  const [token, setToken] = useState<string>();

  useEffect(() => {
    const localToken = window.localStorage.getItem('token');
    if (localToken) {
      setToken(localToken);
    };
  }, []);

  const updateToken = (token: string) => {
    window.localStorage.setItem('token', token);
    setToken(token);
  };

  return (
    <IonApp>
      <IonReactRouter>
        <StateContext.Provider value={{ token }}>
          <Route path="/" render={() => {
            if (token) {
              return <Redirect to="/tabs" />;
            } else {
              return <Login />;
            }
          }} exact />
          <Route path="/tabs" render={() => {
            if (token) {
              return <Tabs />;
            } else {
              return <Redirect to="/" />;
            }
          }} />
          <Route path="/auth" exact render={() => {
            if (token) {
              return <Redirect to="/tabs" />;
            } else {
              return <Auth onUpdateToken={updateToken} />;
            }
          }} />
        </StateContext.Provider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
