import React from "react";
import styles from './PersonalInfoCard.module.scss';
import Card from "./Card";
import {cn} from "../utils";
import {useSelector} from "react-redux";

const getPersonalMassage = (topGenre, audioFeaturesAverage) => {
    let massage = `A big ${topGenre} fan,`;

    let key = null;
    let value = -1;
    const keys = ['danceability', 'energy', 'acousticness', 'instrumentalness', 'valence'];
    keys.forEach(k => {
            if (audioFeaturesAverage[k] > value) {
                key = k;
                value = audioFeaturesAverage[k];
            }
        }
    )
    switch (key) {
        case 'danceability':
            massage += ' who loves to dance!!';
            break;
        case 'energy':
            massage += ' who is full of energy.';
            break;
        case 'acousticness':
            massage += ' who loves acoustic songs.';
            break;
        case 'instrumentalness':
            massage += ' who loves classics.';
            break;
        case 'valence':
            massage += ' who is positive all the time.';
            break;
        default:
            massage += ' who is an Error!!';
    }

    return massage;
}


export default (props) => {
    const data = useSelector(state => state.data);
    let personalMassage = getPersonalMassage(data.topGenres[0][0], data.audioFeaturesAverage);

    return <Card className={cn(props.className, styles.card)}>
        <img src={data.me.images[0].url} alt='profile'/>
        <h2>{data.me.display_name}</h2>
        <hr/>
        <p className={styles.personalMassage}>{personalMassage}</p>
        <ul className={styles.list}>
            <li><span className={styles.tag}>Top Artist</span><span
                className={styles.value}>{data.artistsL.items[0].name}</span></li>
            <li><span className={styles.tag}>Top Track</span><span
                className={styles.value}>{data.tracksL.items[0].name}</span></li>
            <li><span className={styles.tag}>Top Genre</span><span
                className={styles.value}>{data.topGenres[0][0]}</span></li>
            <li><span className={styles.tag}>Least Popular Track</span><span
                className={styles.value}>{data.leastPopularTrack.name}</span></li>
            <li><span className={styles.tag}>Least Popular Artist</span><span
                className={styles.value}>{data.leastPopularArtist.name}</span></li>
        </ul>

    </Card>
}