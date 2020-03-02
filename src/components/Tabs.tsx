import React from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import Artists from '../pages/Artists';
import Tracks from '../pages/Tracks';
import NowPlaying from '../pages/NowPlaying';
import { triangle, ellipse, square, musicalNote, people, musicalNotes } from 'ionicons/icons';

interface TabsProps {
  
}

const Tabs: React.FC<TabsProps> = () => {
  return (
    <IonTabs>
        <IonRouterOutlet>
          <Route path="/tabs/artists" component={Artists} exact={true} />
          <Route path="/tabs/tracks" component={Tracks} exact={true} />
          <Route path="/tabs/nowplaying" component={NowPlaying} />
          <Route path="/tabs" render={() => <Redirect to="/tabs/artists" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="artists" href="/tabs/artists">
            <IonIcon icon={people} />
            <IonLabel>Top Artists</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tracks" href="/tabs/tracks">
            <IonIcon icon={musicalNotes} />
            <IonLabel>Top Tracks</IonLabel>
          </IonTabButton>
          <IonTabButton tab="nowplaying" href="/tabs/nowplaying">
            <IonIcon icon={musicalNote} />
            <IonLabel>Now Playing</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
  );
};

export default Tabs;