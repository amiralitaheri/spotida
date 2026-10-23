import React from "react";
import CustomPlaylistCreator from "../playlistCreators/CustomPlaylistCreator";
import styles from './PlaylistTab.module.scss';
import TopTracksPlaylistCreator from "../playlistCreators/TopTracksPlaylistCreator";
import TopArtistsPlaylistCreator from "../playlistCreators/TopArtistsPlaylistCreator";
import CloneCreator from "../playlistCreators/CloneCreator";
import {useSelector} from "react-redux";

export default () => {
    // The custom playlist relies on Spotify's deprecated recommendations and audio-features APIs.
    const canCreateCustom = useSelector(state => Boolean(state.data.genres && state.data.audioFeaturesAverage));
    return <div className={styles.container}>
        <TopTracksPlaylistCreator/>
        <TopArtistsPlaylistCreator/>
        <CloneCreator/>
        {canCreateCustom && <CustomPlaylistCreator/>}
    </div>
}