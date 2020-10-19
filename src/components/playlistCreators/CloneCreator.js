import React, {useCallback, useRef, useState} from "react";
import Card from "../Card";
import styles from "./TopTracksPlaylistCreator.module.scss";
import Button from "../Button";
import PlaylistResult from "../PlaylistResult";
import debounce from 'lodash/debounce';
import {clonePlaylist as clone} from "../../utils/spotify";
import {useSelector} from "react-redux";
import PlaylistPreview from "../PlaylistPreview";

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
            }).then(
                response => response.json()
            ));
            if (playlist.status !== undefined) {
                console.log(playlist);
                throw new Error();
            }
            setPlaylist(playlist);
        } catch (e) {
            setPlaylist(null);
            setPlaylistState({
                state: 'ERROR',
                message: 'Something is wrong with provided url, or the playlist is private.'
            })
        }
    }, 500), []);

    const clonePlaylist = useCallback(async event => {
        event.preventDefault();
        if (playlistState.state !== 'NORMAL' || playlist == null) return;
        setPlaylistState({state: 'PENDING'});
        try {
            const clonedPlaylist = await clone(data.token, data.me.id, playlist);
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

    }, [playlistState.state, data.token, data.me.id, playlist]);
    return <Card className={props.className}>
        <h1>Clone Playlist</h1>
        <p>Create a clone of another playlist on Spotify.</p>
        <form className={styles.form}>
            <div className={styles.selectContainer}>
                <label htmlFor='playlistUrl'>Playlist Url</label>
                <input ref={urlRef} id='playlistUrl' onChange={fetchPlaylist}/>
            </div>
            {playlist != null ? <PlaylistPreview imageUrl={playlist.images[0].url}
                                                 name={playlist.name}
                                                 description={playlist.description}/> : null}
            <Button onClick={clonePlaylist}>Create</Button>
        </form>
        <PlaylistResult status={playlistState.state} message={playlistState.message}/>
    </Card>
}