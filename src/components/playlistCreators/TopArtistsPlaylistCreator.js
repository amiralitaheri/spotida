import React, {useCallback, useRef, useState} from "react";
import styles from './TopTracksPlaylistCreator.module.scss';
import Card from "../Card";
import Button from "../Button";
import * as Spotify from "../../utils/spotify";
import {useSelector} from "react-redux";
import {MonthNames} from "../../utils";
import PlaylistResult from "../PlaylistResult";
import {getArtistTopTracks} from "../../utils/spotify";

const date = new Date();

export default (props) => {
    const [playlistState, setPlaylistState] = useState({state: 'NORMAL'});
    const data = useSelector(state => state.data);
    const timeRange = useRef();
    const createPlaylist = useCallback(async event => {
        event.preventDefault();
        setPlaylistState({state: 'PENDING'});
        try {
            const tracks = await Promise.all(
                data['artists' + timeRange.current.value].items.slice(0, 20).map(artist => getArtistTopTracks(data.token, artist.id).then(response => response.tracks))
            );
            const tracksUri = [];
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < tracks.length; j++) {
                    tracksUri.push(tracks[j][i].uri)
                }
            }
            let playlist = await Spotify.createPlaylist(data.token, data.me.id, JSON.stringify({
                name: `Top Artist Playlist ${MonthNames[date.getMonth()]} ${date.getFullYear()}`,
                description: `Top Artist Playlist ${MonthNames[date.getMonth()]} ${date.getFullYear()}\nTime range: ${timeRange.current.value}\nCreated by Spotida`
            }));
            await Spotify.addTracksToPlaylist(data.token, tracksUri, playlist.id);
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
        <h1>Top Artist Playlist</h1>
        <p>Create a playlist with your top 20 artists, top 5 tracks.</p>
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