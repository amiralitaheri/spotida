import React, {useCallback, useRef, useState} from "react";
import Card from "../Card";
import styles from "./TopTracksPlaylistCreator.module.scss";
import Button from "../Button";
import PlaylistResult from "../PlaylistResult";
import debounce from 'lodash/debounce';
import {clonePlaylist as clone, getPlaylistPage} from "../../utils/spotify";
import {useSelector} from "react-redux";
import PlaylistPreview from "../PlaylistPreview";
import {fetchToJson} from "../../utils";

export default (props) => {
    const [playlistState, setPlaylistState] = useState({state: 'NORMAL'});
    const [playlist, setPlaylist] = useState(null);
    const data = useSelector(state => state.data);
    const urlRef = useRef();
    const fetchPlaylist = useCallback(debounce(async event => {
        try {
            setPlaylistState({state: 'NORMAL'});
            const playlistId = urlRef.current.value.split('/')[4].split('?')[0];
            const playlist = await (fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                headers: {
                    'Authorization': `Bearer ${data.token}`,
                }
            }).then(fetchToJson));
            if (playlist.status !== undefined) {
                console.log(playlist);
                throw new Error();
            }
            if (!getPlaylistPage(playlist)) {
                // Spotify no longer returns the tracks of playlists the user doesn't own.
                setPlaylist(null);
                setPlaylistState({
                    state: 'ERROR',
                    message: 'Spotify only lets Spotida copy playlists you own or collaborate on.'
                });
                return;
            }
            setPlaylist(playlist);
        } catch (e) {
            setPlaylist(null);
            setPlaylistState({
                state: 'ERROR',
                message: 'Something is wrong with the provided url, or the playlist is private.'
            })
        }
    }, 500), []);

    const clonePlaylist = useCallback(async event => {
        event.preventDefault();
        if (playlistState.state !== 'NORMAL' || playlist == null) return;
        setPlaylistState({state: 'PENDING'});
        try {
            const clonedPlaylist = await clone(data.token, playlist);
            setPlaylistState({
                state: 'SUCCESS',
                message: clonedPlaylist.external_urls.spotify
            });
        } catch (e) {
            setPlaylistState({
                state: 'ERROR',
                message: e.message
            })
        }

    }, [playlistState.state, data.token, playlist]);
    return <Card className={props.className}>
        <h1>Clone Playlist</h1>
        <p>Duplicate one of your playlists, or one you collaborate on.</p>
        <form className={styles.form}>
            <div className={styles.selectContainer}>
                <label htmlFor='playlistUrl'>Playlist Url</label>
                <input ref={urlRef} id='playlistUrl' onChange={fetchPlaylist} style={{flexGrow: 1}}/>
            </div>
            {playlist != null ? <PlaylistPreview imageUrl={playlist.images?.[0]?.url}
                                                 name={playlist.name}
                                                 description={playlist.description}/> : null}
            <Button onClick={clonePlaylist}>Create</Button>
        </form>
        <PlaylistResult status={playlistState.state} message={playlistState.message}/>
    </Card>
}