import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';

interface LoginProps {
}

const Login: React.FC<LoginProps> = () => {

  const handleLogin = () => {
    window.location.replace(`https://accounts.spotify.com/authorize?client_id=850a91fb7e314e3a99db8c181def340e&redirect_uri=${window.location.origin}/auth&scope=user-read-currently-playing%20user-read-email%20user-library-read%20streaming%20user-read-recently-played%20user-top-read%20user-modify-playback-state%20user-read-playback-state&show_dialog=true&response_type=token`);  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spotify Ionic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <IonButton onClick={handleLogin}>Log in with Spotify</IonButton>
        
      </IonContent>
    </IonPage>
  );
};

export default Login;