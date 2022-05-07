import React from "react";
import styles from './ArtistCard.module.scss';

export default ({artist, index}) => <div className={styles.artist}>
    <img src={artist.images[artist.images.length - 2]?.url || 'profile-default.jpg'}
         alt={artist.name}/>
    <h5>{artist.name}</h5>
    {!isNaN(index) && <div className={styles.index}>#{index + 1}</div>}
</div>