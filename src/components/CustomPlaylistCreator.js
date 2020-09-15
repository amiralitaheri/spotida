import React, {useCallback, useReducer, useState} from "react";
import Card from "./Card";
import styles from './CustomPlaylistCreator.module.scss'
import Slider from "./Slider";
import {useSelector} from "react-redux";
import Button from "./Button";
import GenreSelection from "./GenreSelection";

const reducer = (state, action) => {
    switch (action.name) {
        case 'danceability':
            return {...state, danceability: action.value}
        case 'energy':
            return {...state, energy: action.value}
        case 'acousticness':
            return {...state, acousticness: action.value}
        case 'speechiness':
            return {...state, speechiness: action.value}
        case 'instrumentalness':
            return {...state, instrumentalness: action.value}
        case 'valence':
            return {...state, valence: action.value}
        case 'liveness':
            return {...state, liveness: action.value}
        case 'tempo':
            return {...state, tempo: action.value}
        case 'name':
            return {...state, name: action.value}
        case 'genres':
            return {...state, genres: action.value}
        default:
            throw new Error();
    }
}
const sliderSetting = {
    danceability: {
        min: 0,
        max: 100,
        step: 1
    },
    energy: {
        min: 0,
        max: 100,
        step: 1
    },
    acousticness: {
        min: 0,
        max: 100,
        step: 1
    },
    speechiness: {
        min: 0,
        max: 100,
        step: 1
    },
    instrumentalness: {
        min: 0,
        max: 100,
        step: 1
    },
    valence: {
        min: 0,
        max: 100,
        step: 1
    },
    liveness: {
        min: 0,
        max: 100,
        step: 1
    },
    tempo: {
        min: 20,
        max: 500,
        step: 5
    },

}
const date = (new Date()).toISOString().split('T')[0];

//todo: find out why component renders twice!
export default (props) => {
    const data = useSelector(state => state.data);
    const initialState = useCallback({
        danceability: Math.round(data.audioFeaturesAverage.danceability * 100),
        energy: Math.round(data.audioFeaturesAverage.energy * 100),
        acousticness: Math.round(data.audioFeaturesAverage.acousticness * 100),
        speechiness: Math.round(data.audioFeaturesAverage.speechiness * 100),
        instrumentalness: Math.round(data.audioFeaturesAverage.instrumentalness * 100),
        valence: Math.round(data.audioFeaturesAverage.valence * 100),
        liveness: Math.round(data.audioFeaturesAverage.liveness * 100),
        tempo: Math.round(data.audioFeaturesAverage.tempo),
        name: `Spotify-data custom playlist ${date}`,
        genres: [
            "alt-rock",
            "alternative",
        ]
    }, [data])
    const [state, dispatch] = useReducer(reducer, initialState);
    const [playlistState, setPlaylistState] = useState({state: 'NORMAL'});
    const handleChange = useCallback((name, event, newValue) => {
        dispatch({
            name: name,
            value: newValue
        });
    }, []);

    //todo: clean this mess
    const createPlaylist = useCallback(event => {
        event.preventDefault();
        setPlaylistState({state: 'PENDING'});
        const options = {
            headers: {
                'Authorization': `Bearer ${data.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        const {genres, name, tempo, ...filters} = state;
        const filtersString = Object.keys(filters).map(key => `target_${key}=${filters[key] / 100}`).join('&')
        const url = `https://api.spotify.com/v1/recommendations?limit=100&seed_genres=${genres.join(',')}&target_tempo=${tempo}&${filtersString}`
        fetch(url, options).then(
            response => {
                if (response.status !== 200 && response.status !== 201) {
                    throw new Error(`Received a ${response.status} from Spotify`);
                }
                return response.json();
            }
        ).then(
            browse => {
                fetch(`https://api.spotify.com/v1/users/${data.me.id}/playlists`, {
                    ...options,
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                        description: JSON.stringify(state)
                    })
                }).then(
                    response => {
                        if (response.status !== 200 && response.status !== 201) {
                            throw new Error(`Received a ${response.status} from Spotify`);
                        }
                        return response.json();
                    }
                ).then(
                    playlist => {
                        fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks?uris=${browse.tracks.map(track => track.uri).join(',')}`).then(
                            response => {
                                if (response.status !== 200 && response.status !== 201) {
                                    throw new Error(`Received a ${response.status} from Spotify`);
                                }
                                setPlaylistState({state: 'SUCCESS'})
                            }
                        ).catch(
                            error => setPlaylistState({
                                state: 'ERROR',
                                message: error.message
                            })
                        )

                    }
                ).catch(
                    error => setPlaylistState({
                        state: 'ERROR',
                        message: error.message
                    })
                )
            }
        ).catch(
            error => setPlaylistState({
                state: 'ERROR',
                message: error.message
            })
        )
    }, [state, data]);

    // todo: change with snackbar or something
    let buttonText;
    switch (playlistState.state) {
        case 'PENDING':
            buttonText = 'Pending...';
            break;
        case 'SUCCESS':
            buttonText = 'Created';
            break;
        case 'ERROR':
            buttonText = playlistState.message;
            break;
        default:
            buttonText = 'Create';
    }

    return <Card className={props.className}>
        <h2>Custom Playlist</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, animi atque beatae culpa doloribus
            error explicabo in ipsam laudantium maxime nisi, nostrum omnis repellendus rerum sint unde ut velit,
            voluptatum?</p>
        <form className={styles.form}>
            <label htmlFor='name'>Name</label>
            <input id='name' type="text" value={state.name}
                   onChange={useCallback(event => handleChange('name', event, event.target.value), [handleChange])}
                   className={styles.input}/>
            <label>Genres (maximum: 5)</label>
            <GenreSelection value={state.genres}
                            onChange={useCallback((newValue) => handleChange('genres', null, newValue), [handleChange])}/>
            {Object.keys(sliderSetting).map(key => {
                return <Slider
                    key={key}
                    name={key}
                    value={state[key]}
                    onChange={useCallback((event, newValue) => handleChange(key, event, newValue), [key])}
                    aria-labelledby={key}
                    valueLabelDisplay="auto"
                    min={sliderSetting[key].min}
                    max={sliderSetting[key].max}
                    step={sliderSetting[key].step}
                />
            })}
            <Button
                onClick={createPlaylist}
                disabled={playlistState.state === 'PENDING'}
                style={{backgroundColor: playlistState.state === 'ERROR' ? '#f44336' : '#1db954'}}
            >{buttonText}</Button>
        </form>
    </Card>
}