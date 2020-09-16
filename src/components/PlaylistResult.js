import React from "react";
import styles from "./PlaylistResult.module.scss";
import {cn} from "../utils";

export default (props) => {
    switch (props.status) {
        case 'PENDING':
            return <span className={cn(styles.result, styles.pending)}>Wait a second</span>
        case 'SUCCESS':
            return <span className={cn(styles.result, styles.success)}>Created successfully! <a
                href={props.message}>{props.message}</a></span>
        case 'ERROR':
            return <span className={cn(styles.result, styles.error)}>{props.message}</span>
        default:
            return null;
    }
}