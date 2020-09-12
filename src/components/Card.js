import React from "react";
import styles from './Card.module.scss'

export default (props) =>
    <div className={styles.card}>
        {props.children}
    </div>
