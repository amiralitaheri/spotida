import React from "react";
import styles from './PlaylistPreview.module.scss';

export default ({imageUrl, name, description}) => <div className={styles.container}>
    <img src={imageUrl} alt='Playlist Cover'/>
    <div className={styles.text}>
        <h2>{name}</h2>
        <p>{description}</p>
    </div>
</div>