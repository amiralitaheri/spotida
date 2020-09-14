import React, {useCallback, useReducer} from "react";
import Card from "./Card";
import styles from './CustomPlaylistCreator.module.scss'
import Slider from "./Slider";
import {useSelector} from "react-redux";
import Button from "./Button";
import GenreSelection from "./GenreSelection";
import {cn} from "../utils";

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
export default (props) => {
    const average = useSelector(state => state.data.audioFeaturesAverage);
    const initialState = {
        danceability: Math.round(average.danceability * 100),
        energy: Math.round(average.energy * 100),
        acousticness: Math.round(average.acousticness * 100),
        speechiness: Math.round(average.speechiness * 100),
        instrumentalness: Math.round(average.instrumentalness * 100),
        valence: Math.round(average.valence * 100),
        liveness: Math.round(average.liveness * 100),
        tempo: Math.round(average.tempo),
        name: `Spotify-data custom playlist ${date}`,
        genres: [
            "alt-rock",
            "alternative",
        ]
    }
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleChange = useCallback((name, event, newValue) => {
        dispatch({
            name: name,
            value: newValue
        });
    }, []);

    const createPlaylist = event => {
        event.preventDefault();
    }

    return <Card className={cn(styles.card, props.className)}>
        <h2>Custom Playlist</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, animi atque beatae culpa doloribus
            error explicabo in ipsam laudantium maxime nisi, nostrum omnis repellendus rerum sint unde ut velit,
            voluptatum?</p>
        <form className={styles.form}>
            <label for='name'>Name</label>
            <input id='name' type="text" value={state.name}
                   onChange={useCallback(event => handleChange('name', event, event.target.value), [])}
                   className={styles.input}/>
            <label>Genres (maximum: 5)</label>
            <GenreSelection value={state.genres}
                            onChange={useCallback((newValue) => handleChange('genres', null, newValue), [])}/>
            {Object.keys(sliderSetting).map(key => {
                return <Slider
                    key={key}
                    name={key}
                    value={state[key]}
                    onChange={useCallback((event, newValue) => handleChange(key, event, newValue), [])}
                    aria-labelledby={key}
                    valueLabelDisplay="auto"
                    min={sliderSetting[key].min}
                    max={sliderSetting[key].max}
                    step={sliderSetting[key].step}
                />
            })}
            <Button onClick={createPlaylist}>Create</Button>
        </form>
    </Card>
}