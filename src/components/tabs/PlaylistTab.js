import React from "react";
import CustomPlaylistCreator from "../playlistCreators/CustomPlaylistCreator";
import styles from './PlaylistTab.module.scss';
import TopTracksPlaylistCreator from "../playlistCreators/TopTracksPlaylistCreator";
import TopArtistsPlaylistCreator from "../playlistCreators/TopArtistsPlaylistCreator";

export default () => <div className={styles.container}>
    <TopTracksPlaylistCreator/>
    <TopArtistsPlaylistCreator/>
    <CustomPlaylistCreator/>
</div>