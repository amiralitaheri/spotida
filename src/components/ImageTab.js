import React, {useCallback, useRef, useState} from "react";
import styles from "./ImageTab.module.scss";
import Card from "./Card";
import Button from "./Button";
import {useSelector} from "react-redux";
import imagePainter from "../utils/imagePainter";
import {FaDownload} from 'react-icons/fa'

const monthNames = ["Jan.", " Feb.", "Mar.", "Apr.", "May", "Jun.",
    "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
];
const date = new Date();

export default () => {
    const canvas = useRef();
    const data = useSelector(state => state.data);
    const [canvasState, setCanvasState] = useState('EMPTY');
    const download = useCallback(event => {
        event.preventDefault();
        window.open(canvas.current.toDataURL('image/png'));
    }, []);

    const createImage = useCallback(event => {
        event.preventDefault();
        const imageSource = document.getElementById('ImageSource').value;
        const timeRange = document.getElementById('timeRange').value;
        const imageStyle = document.getElementById('imageStyle').value;
        let images;
        if (imageSource === 'artists') {
            images = data[imageSource + timeRange].items.map(artist => ({
                name: artist.name,
                url: artist.images[1].url
            }))
        } else {
            images = data[imageSource + timeRange].items.map(track => ({
                name: track.name,
                url: track.album.images[1].url
            }))
        }
        imagePainter(`my top ${imageSource} ${monthNames[date.getMonth()]} ${date.getFullYear()}`, images, imageStyle, canvas.current).then(
            () => {
                setCanvasState('FULL');
            }
        );
    }, [data])
    return <div className={styles.container}>
        <Card>
            <h1>Create an image</h1>
            <p>Create an image from your top artist or your top tracks and share it with others.</p>

            <form className={styles.form}>
                <div className={styles.selectContainer}>
                    <label htmlFor='ImageSource'>Image Source</label>
                    <select id='ImageSource'>
                        <option value="artists">Top Artists</option>
                        <option value="tracks">Top Tracks</option>
                    </select>
                </div>
                <div className={styles.selectContainer}>
                    <label htmlFor='timeRange'>Time Range</label>
                    <select id='timeRange'>
                        <option value="S">Last Month</option>
                        <option value="M">Last 6 Months</option>
                        <option value="L">All Time</option>
                    </select>
                </div>
                <div className={styles.selectContainer}>
                    <label htmlFor='imageStyle'>Image Style</label>
                    <select id='imageStyle'>
                        <option value="photo">Photo</option>
                        <option value="circle">Circle</option>
                    </select>
                </div>
                <Button onClick={createImage}>Create</Button>
            </form>
            <canvas className={styles.canvas} ref={canvas}/>
            {canvasState === 'FULL' ?
                <>
                    <p className={styles.hint}>Download to see full quality</p>
                    <div className={styles.buttonContainer}>
                        <Button className={styles.download} onClick={download}><FaDownload/> Download</Button>
                    </div>
                </> : null}

        </Card>
    </div>
}