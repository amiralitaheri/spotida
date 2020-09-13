import React from "react";
import {Radar} from 'react-chartjs-2';

export default () => {
    const data = {
        labels: ['Acoustic', 'Dance', 'Energy', 'Instrumental', 'Loudness', 'Positive vibe'],
        datasets: [{
            data: [30, 80, 75, 25, 80, 80],
            backgroundColor: 'rgba(30,215,96,0.5)',
            borderColor: '#1ed760',
        }],

    }
    const options = {
        legend: {
            display: false
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
        responsive: true,
        aspectRatio: 1
    }
    return <Radar data={data} options={options}/>
}