import React from "react";
import styles from './Container.module.scss';

export default (props) =>
    <section className={styles.container}>
        {props.children}
    </section>