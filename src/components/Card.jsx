import React from "react";
import styles from './Card.module.scss'
import {cn} from "../utils";

export default (props) =>
    <div className={cn(styles.card, props.className)}>
        {props.children}
    </div>
