import React from "react";
import {useSelector} from "react-redux";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from 'chart.js';
import {Radar} from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip
);

export default () => {
    const values = useSelector(state => state.data.audioFeaturesAverage);
    const data = {
        labels: ['Acoustic', 'Dance', 'Energy', 'Instrumental', 'Positiveness'],
        datasets: [{
            data: [values.acousticness * 100, values.danceability * 100, values.energy * 100, values.instrumentalness * 100, values.valence * 100],
            backgroundColor: 'rgba(30,215,96,0.5)',
            borderColor: '#1ed760',
        }],

    }
    const options = {
        plugins: {
            legend: {
                display: false
            }
        },
        scale: {
            ticks: {
                beginAtZero: true,
                max: 100,
                min: 0,
                stepSize: 20,
                fontColor: '#A4A4A4',
            },
            pointLabels: {
                fontColor: '#A4A4A4',
            },
        },
        maintainAspectRatio: false
    }
    return <Radar data={data} options={options}/>
}