import React from "react";
import Card from "./Card";
import styles from './DiagramCard.module.scss';
import {cn} from "../utils";
import DonutChart from "./DonutChart";
import RadarChart from "./RadarChart";
import {useSelector} from "react-redux";

//todo: change chart library

export default (props) => {
    const hasAudioFeatures = useSelector(state => Boolean(state.data.audioFeaturesAverage));
    const hasGenres = useSelector(state => state.data.topGenres.some(item => item[0] !== 'others'));
    if (!hasAudioFeatures && !hasGenres) return null;
    return <Card className={cn(props.className, styles.card)}>
        {hasGenres && <div className={styles.chart}>
            <h2>Top genres</h2>
            <div className={styles.chartContainer}>
                <DonutChart/>
            </div>
        </div>}
        {hasAudioFeatures && <div className={styles.chart}>
            <h2>Music Breakdown</h2>
            <div className={styles.chartContainer}>
                <RadarChart/>
            </div>
        </div>}

    </Card>
}

