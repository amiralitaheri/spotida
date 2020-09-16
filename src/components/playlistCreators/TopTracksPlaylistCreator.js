import React, {useCallback, useRef, useState} from "react";
import styles from './TopTracksPlaylistCreator.module.scss';
import Card from "../Card";
import Button from "../Button";
import * as Spotify from "../../utils/spotify";
import {useSelector} from "react-redux";
import {MonthNames} from "../../utils";
import PlaylistResult from "../PlaylistResult";

const date = new Date();

export default (props) => {
    const [playlistState, setPlaylistState] = useState({state: 'NORMAL'});
    const data = useSelector(state => state.data);
    const timeRange = useRef();
    const createPlaylist = useCallback(async event => {
        event.preventDefault();
        setPlaylistState({state: 'PENDING'});
        try {
            let playlist = await Spotify.createPlaylist(data.token, data.me.id, JSON.stringify({
                name: `Top tracks ${MonthNames[date.getMonth()]} ${date.getFullYear()}`,
                description: `Top tracks ${MonthNames[date.getMonth()]} ${date.getFullYear()}\nTime range: ${timeRange.current.value}\nCreated by Spotida`
            }));
            await Spotify.addTracksToPlaylist(data.token, data['tracks' + timeRange.current.value].items.map(track => track.uri), playlist.id);
            setPlaylistState({
                state: 'SUCCESS',
                message: playlist.external_urls.spotify
            });
        } catch (e) {
            setPlaylistState({
                state: 'ERROR',
                message: e.message
            })
        }
    }, [data])
    return <Card className={props.className}>
        <h1>Top Tracks Playlist</h1>
        <p>Create a playlist from your top tracks.</p>
        <form className={styles.form}>
            <div className={styles.selectContainer}>
                <label htmlFor='timeRange'>Time Range</label>
                <select id='timeRange' ref={timeRange}>
                    <option value="S">Last Month</option>
                    <option value="M">Last 6 Months</option>
                    <option value="L">All Time</option>
                </select>
            </div>
            <Button onClick={createPlaylist}>Create</Button>
        </form>
        <PlaylistResult status={playlistState.state} message={playlistState.message}/>
    </Card>
}