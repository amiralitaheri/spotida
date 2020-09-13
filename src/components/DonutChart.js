import React from "react";
import {Doughnut} from 'react-chartjs-2';

export default () => {
    const data = {
        datasets: [{
            data: [10, 20, 30],
            backgroundColor: [
                '#1ed760',
                '#3EDD51',
                '#6CE25D',
                '#A1E87D',
                '#CBED9C',
                '#E8F3BC',],
            hoverBackgroundColor: '#1db954'
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ]
    };

    const options = {
        legend: {
            labels: {
                boxWidth: 12,
                fontColor: '#A4A4A4'
            }
        }
    }
    return <Doughnut data={data} options={options}/>
}