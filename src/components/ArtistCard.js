import React from "react";
import styles from './ArtistCard.module.scss';

export default ({artist}) => <div className={styles.artist}>
    <img src={artist.images[artist.images.length - 2]?.url || 'profile-default.jpg'}
         alt={artist.name}/>
    <h5>{artist.name}</h5>
</div>