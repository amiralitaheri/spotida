import React, {useState} from "react";
import Card from "./Card";
import {cn} from "../utils";
import {useSelector} from "react-redux";
import styles from './TopCard.module.scss';
import TrackCard from "./TrackCard";

export default (props) => {
    const [timeRange, setTimeRange] = useState('short');
    const tracks = useSelector(state => ({
        'short': state.data.tracksS.items,
        'medium': state.data.tracksM.items,
        'long': state.data.tracksL.items
    }))
    return <Card className={cn(props.className, styles.card)}>
        <h2 className={styles.title}>Top tracks</h2>
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
            {tracks[timeRange].map(track =>
                <li key={track.id}>
                    <TrackCard track={track}/>
                    <hr/>
                </li>)}
        </ol>
    </Card>
}