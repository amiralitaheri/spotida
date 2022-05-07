import React from "react";
import styles from './TrackCard.module.scss';

export default ({track}) => {
    return <div className={styles.track}>
        <img src={track.album.images[1]?.url || 'track-image-default.png'}
             alt={track.name}/>
        <div className={styles.description}>
            <h5>{track.name}</h5>
            <span>{track.artists.map(artist => artist.name).join(' & ')}</span>
        </div>
    </div>
}