import React, { useContext, useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonSegment, IonSegmentButton, IonLabel, IonAvatar, IonThumbnail } from '@ionic/react';
import StateContext from '../components/StateContext';
import { useHistory } from 'react-router';

interface ArtistsProps {
}

interface Artist {
  id: string;
  name: string;
  images: {
    small: string;
    medium: string;
    large: string;
  };
}

const Artists: React.FC<ArtistsProps> = () => {

  const context = useContext(StateContext);
  const [term, setTerm] = useState('long_term');

  const [artists, setArtists] = useState<Artist[]>([]);
  const history = useHistory();

  useEffect(() => {

    const doQuery = async () => {
      try {
      const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=40&time_range=' + term, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${context.token}`
        }
      });
      const data = await response.json();
      const artists = data.items.map((d: any) => {
        return {
          id: d.id,
          name: d.name,
          images: {
            large: d.images[0].url,
            medium: d.images[0].url,
            small: d.images[0].url
          }
        };
      }) as Artist[];
      setArtists(artists);
    } catch {
      window.localStorage.removeItem('token');
      history.push('/')
    }
    };

    doQuery();

  }, [term]);

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonSegment value={term} onIonChange={e => {
            setArtists([]);
            setTerm(e.detail.value!);
          }}>
            <IonSegmentButton value="long_term">
              <IonLabel>All Time</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="medium_term">
              <IonLabel>6 Months</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="short_term">
              <IonLabel>1 Month</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Top Artists</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {artists.map(artist => (
            <IonItem key={artist.id}>
              <IonThumbnail slot="start">
                <img src={artist.images.small} />
              </IonThumbnail>
              <IonLabel>
                <h2>{artist.name}</h2>
              </IonLabel>

            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Artists;