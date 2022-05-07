import React, {useRef, useState} from "react";
import styles from "./ImageTab.module.scss";
import Card from "../Card";
import Button from "../Button";
import {useSelector} from "react-redux";
import imagePainter from "../../utils/imagePainter";
import {FaDownload} from 'react-icons/fa'
import {MonthNames} from "../../utils";

const date = new Date();

export default () => {
    const canvas = useRef();
    const downloadLink = useRef();
    const data = useSelector(state => state.data);
    const [canvasState, setCanvasState] = useState('EMPTY');
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

    const createImage = event => {
        event.preventDefault();
        if (canvasState === 'PENDING') return;
        setCanvasState('PENDING');
        const imageSource = document.getElementById('ImageSource').value;
        const timeRange = document.getElementById('timeRange').value;
        const imageStyle = document.getElementById('imageStyle').value;
        const font = document.getElementById('font').value;
        let images;
        if (imageSource === 'artists') {
            images = data[imageSource + timeRange].items.map(artist => ({
                name: artist.name,
                url: artist.images[1]?.url
            }))
        } else {
            images = data[imageSource + timeRange].items.map(track => ({
                name: track.name,
                url: track.album.images[1]?.url
            }))
        }
        imagePainter({
            canvas: canvas.current,
            type: imageStyle,
            images,
            options: {
                title: `My top ${imageSource} ${MonthNames[date.getMonth()]} ${date.getFullYear()}`,
                backgroundColor,
                font
            }
        }).then(
            () => {
                setCanvasState('FULL');
                downloadLink.current = canvas.current.toDataURL('image/jpg');
            }
        );
    };
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
                <div className={styles.selectContainer}>
                    <label htmlFor='font'>Font</label>
                    <select id='font'>
                        <option value='bold 48px Indie Flower'>Indie Flower</option>
                        <option value='bold 48px Calibri'>Calibri</option>
                    </select>
                </div>
                <div className={styles.selectContainer}>
                    <label htmlFor='backgroundColor'>Background Color</label>
                    <input value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} type="color"/>
                </div>
                <Button className={styles.button} onClick={createImage}>Create</Button>
            </form>
            <canvas className={styles.canvas} ref={canvas}/>
            {canvasState === 'FULL' ?
                <>
                    <p className={styles.hint}>Download to see full quality</p>
                    <div className={styles.buttonContainer}>
                        <a className={styles.download} href={downloadLink.current}
                           download="spotida.jpg"><FaDownload/> Download</a>
                    </div>
                </> : null}

        </Card>
    </div>
}