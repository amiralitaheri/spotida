import React from "react";
import styles from './StateTab.module.scss';
import PersonalInfoCard from "./PersonalInfoCard";
import DiagramCard from "./DiagramCard";
import TopArtistsCard from "./TopArtistsCard";
import TopTracksCard from "./TopTracksCard";

export default () => {
    return <div className={styles.grid}>
        <PersonalInfoCard className={styles.info}/>
        <DiagramCard className={styles.diagram}/>
        <TopArtistsCard className={styles.topArtists}/>
        <TopTracksCard className={styles.topTracks}/>
    </div>
}