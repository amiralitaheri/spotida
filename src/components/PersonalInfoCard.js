import React from "react";
import styles from './PersonalInfoCard.module.scss';
import Card from "./Card";
import {cn} from "../utils";
import {useSelector} from "react-redux";

export default (props) => {
    const data = useSelector(state => state.data);
    return <Card className={cn(props.className, styles.card)}>
        <img src={data.me.images[0].url} alt='profile'/>
        <h2>{data.me.display_name}</h2>
        <hr/>

    </Card>
}