import React, {useState} from "react";
import Card from "./Card";
import {cn} from "../utils";
import {useSelector} from "react-redux";
import ArtistCard from "./ArtistCard";
import styles from './TopArtistsCard.module.scss';

export default (props) => {
    const [timeRange, setTimeRange] = useState('short');
    const artists = useSelector(state => ({
        'short': state.data.artistsS.items,
        'medium': state.data.artistsM.items,
        'long': state.data.artistsL.items
    }))
    return <Card className={cn(props.className, styles.card)}>
        <ol>
            {artists[timeRange].map(artist =>
                <li key={artist.id}>
                    <ArtistCard artist={artist}/>
                    <hr/>
                </li>)}
        </ol>
    </Card>
}