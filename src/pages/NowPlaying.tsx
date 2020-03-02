import React, { useContext, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, IonRange, IonIcon } from '@ionic/react';
import StateContext from '../components/StateContext';
import './NowPlaying.css';
import { heart, heartOutline, playSkipBack, play, pause, playSkipForward, removeCircleOutline, pauseOutline, playOutline } from 'ionicons/icons';

interface NowPlayingProps {
}

interface Track {
  id: string;
  title: string;
  artists: string;
  progress: number;
  duration: number;
  device: string;
  images: {
    small: string;
    medium: string;
    large: string;
  };
  playing: boolean;
}

const NowPlaying: React.FC<NowPlayingProps> = () => {

  const context = useContext(StateContext);

  const [nowPlaying, setNowPlaying] = useState<Track>();

  useIonViewDidEnter(async () => {
    getNowPlaying();
  });

  const getNowPlaying = async () => {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${context.token}`
      }
    });
    const data = await response.json();
    const nowPlaying = {
      id: data.item.id,
      title: data.item.name,
      album: data.item.album.name,
      artists: data.item.artists.reduce((cur: any, prev: any) => prev.name + ', ' + cur, '').slice(0, -2),
      images: {
        large: data.item.album.images[0].url,
        medium: data.item.album.images[0].url,
        small: data.item.album.images[0].url
      },
      progress: data.progress_ms,
      duration: data.item.duration_ms,
      device: data.device.name,
      playing: data.is_playing
    };

    setNowPlaying(nowPlaying);
  };

  const handlePlay = async (track: Track) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${context.token}`
      },
      body: JSON.stringify({
        uris: [`spotify:track:${track.id}`],
        position_ms: track.progress
      })
    });
    await getNowPlaying();
  };

  const handlePause = async (track: Track) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${context.token}`
      },
      body: JSON.stringify({
        uris: [`spotify:track:${track.id}`]
      })
    });
    await getNowPlaying();
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Now Playing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="track-content">

        {nowPlaying && (
          <div>
            <img src={nowPlaying.images.small} />
            <h2>{nowPlaying.title}</h2>
            <h4>{nowPlaying.artists}</h4>
            <h4>Playing on {nowPlaying.device}</h4>
            <TrackProgress
              track={nowPlaying} />
            <TrackControls
              playing={nowPlaying.playing}
              onPause={() => handlePause(nowPlaying)}
              onPlay={() => handlePlay(nowPlaying)}
            />

          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

interface TrackProgressProps {
  track: Track;
  // onSeek: any;
}

const TrackProgress: React.FC<TrackProgressProps> = ({ track }) => {
  const progress = track.progress;
  const left = track.duration - progress;
  const percent = (progress / track.duration) * 100;

  // const s = (p) => {
  //   const newTime = (p / 100) * track.time;
  //   onSeek(newTime);
  // }
  return (
    <div className="track-progress">
      <IonRange
        value={percent}
      // onIonChange={(e) => { s(e.target.value)}} />
      />
      <div className="track-progress-time">
        <div className="track-progress-time-current">
          {msToTime(progress)}
        </div>
        <div className="track-progress-time-left">
          -{msToTime(left)}
        </div>
      </div>
    </div>
  );
};

interface TrackControlsProps {
  playing: boolean;
  onPause: any;
  onPlay: any;
}


const TrackControls: React.FC<TrackControlsProps> = ({ playing, onPause, onPlay }) => {
  return (
    <div className="track-controls">
      {/* <IonIcon onClick={onFav} icon={isFav ? heart : heartOutline} />
    <IonIcon onClick={onPrev} icon={playSkipBack} /> */}
      {playing ? (
        <IonIcon onClick={onPause} className="play-pause" icon={pauseOutline} />
      ) : (
          <IonIcon onClick={onPlay} className="play-pause" icon={playOutline} />
        )}
      {/* <IonIcon onClick={onNext} icon={playSkipForward} /> */}
      {/* <IonIcon icon={removeCircleOutline} /> */}
    </div>
  );
};


export const msToTime = (d: number) => {
  var seconds = Math.floor((d / 1000) % 60),
    minutes = Math.floor((d / (1000 * 60)) % 60);

  return minutes + ":" + (seconds < 10 ? `0${seconds}` : seconds);
};


export default NowPlaying;