import React from "react";
import Card from "./Card";
import styles from './DiagramCard.module.scss';
import {cn} from "../utils";
import DonutChart from "./DonutChart";
import RadarChart from "./RadarChart";


export default (props) => {
    return <Card className={cn(props.className, styles.card)}>
        <div className={styles.chart}>
            <h2>Top genres</h2>
            <DonutChart/>
        </div>
        <div className={styles.chart}>
            <h2>Music Breakdown</h2>
            <RadarChart/>
        </div>

    </Card>
}

