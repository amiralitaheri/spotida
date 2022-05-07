import React from "react";
import styles from './Container.module.scss';
import {cn} from "../utils";

export default (props) =>
    <section className={cn(styles.container, props.className)}>
        {props.children}
    </section>