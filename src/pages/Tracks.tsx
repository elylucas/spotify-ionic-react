import React, { useContext, useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonSegment, IonSegmentButton, IonLabel, IonAvatar, IonThumbnail } from '@ionic/react';
import StateContext from '../components/StateContext';
import { useHistory } from 'react-router';

interface TrackProps {
}

interface Track {
  id: string;
  name: string;
  album: string;
  artists: string;
  images: {
    small: string;
    medium: string;
    large: string;
  };
}

const Tracks: React.FC<TrackProps> = () => {

  const context = useContext(StateContext);
  const [term, setTerm] = useState('long_term');

  const [tracks, setTracks] = useState<Track[]>([]);

  const history = useHistory();

  useEffect(() => {

    const doQuery = async () => {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=40&time_range=' + term, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${context.token}`
        }
      });
      const data = await response.json();
      const tracks = data.items.map((d: any) => {
        return {
          id: d.id,
          name: d.name,
          album: d.album.name,
          artists: d.artists.reduce((cur: any, prev: any) => prev.name + ', ' + cur, '').slice(0, -2),
          images: {
            large: d.album.images[0].url,
            medium: d.album.images[0].url,
            small: d.album.images[0].url
          }
        };
      }) as Track[];
      setTracks(tracks);
    };

    doQuery();

  }, [term]);

  const handlePlayTrack = async (track: Track) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${context.token}`
        },
        body: JSON.stringify({          
          uris: [`spotify:track:${track.id}`]          
        })
      });
    history.push('/tabs/nowplaying')
  }

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonSegment value={term} onIonChange={e => {
            setTracks([]);
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
            <IonTitle size="large">Top Tracks</IonTitle>
          </IonToolbar>
        </IonHeader>


        <IonList>
          {tracks.map(track => (
            <IonItem key={track.id} onClick={() => handlePlayTrack(track)}>
              <IonThumbnail slot="start">
                <img src={track.images.small} />
              </IonThumbnail>
              <IonLabel>
                <h2>{track.name}</h2>
                <p>{track.artists}</p>
              </IonLabel>

            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tracks;