import React from "react";
import styles from './ArtistCard.module.scss';

export default ({artist}) => <div className={styles.artist}>
    <img src={artist.images[2].url} alt={artist.name}/>
    <h5>{artist.name}</h5>
</div>