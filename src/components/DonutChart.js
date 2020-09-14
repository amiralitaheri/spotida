import React from "react";
import {Doughnut} from 'react-chartjs-2';
import {useSelector} from "react-redux";

export default () => {
    const topGenres = useSelector(state => state.data.topGenres)
    const data = {
        datasets: [{
            data: topGenres.map(item => item[1]),
            backgroundColor: [
                '#1ed760',
                '#2EDA5B',
                '#3EDD59',
                '#4DDF59',
                '#5EE25D',
                '#79E56D',
                '#91E87D',
                '#A7EB8C',
                '#BBED9C',
                '#CCF0AC',
                '#DBF3BC'],
            hoverBackgroundColor: '#1db954'
        }],

        labels: topGenres.map(item => item[0])
    };

    const options = {
        legend: {
            labels: {
                boxWidth: 12,
                fontColor: '#A4A4A4'
            }
        },
        maintainAspectRatio:false
    }
    return <Doughnut data={data} options={options}/>
}