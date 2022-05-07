import React from "react";
import CustomPlaylistCreator from "../playlistCreators/CustomPlaylistCreator";
import styles from './PlaylistTab.module.scss';
import TopTracksPlaylistCreator from "../playlistCreators/TopTracksPlaylistCreator";
import TopArtistsPlaylistCreator from "../playlistCreators/TopArtistsPlaylistCreator";
import CloneCreator from "../playlistCreators/CloneCreator";

export default () => <div className={styles.container}>
    <TopTracksPlaylistCreator/>
    <TopArtistsPlaylistCreator/>
    <CloneCreator/>
    <CustomPlaylistCreator/>
</div>