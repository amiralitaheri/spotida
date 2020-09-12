import React, {useState} from "react";
import Card from "./Card";
import {cn} from "../utils";
import {useSelector} from "react-redux";
import ArtistCard from "./ArtistCard";
import styles from './TopCard.module.scss';

export default (props) => {
    const [timeRange, setTimeRange] = useState('short');
    const artists = useSelector(state => ({
        'short': state.data.artistsS.items,
        'medium': state.data.artistsM.items,
        'long': state.data.artistsL.items
    }))
    return <Card className={cn(props.className, styles.card)}>
        <h2 className={styles.title}>Top artists</h2>
        <div className={styles.buttons}>
            <button id={cn(timeRange === 'short' && styles.selected)} onClick={() => {
                setTimeRange('short')
            }}>Last month
            </button>
            <button id={cn(timeRange === 'medium' && styles.selected)} onClick={() => {
                setTimeRange('medium')
            }}>Last 6 months
            </button>
            <button id={cn(timeRange === 'long' && styles.selected)} onClick={() => {
                setTimeRange('long')
            }}>All time
            </button>
        </div>
        <ol>
            {artists[timeRange].map(artist =>
                <li key={artist.id}>
                    <ArtistCard artist={artist}/>
                    <hr/>
                </li>)}
        </ol>
    </Card>
}