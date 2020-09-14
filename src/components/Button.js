import React from "react";
import styles from './Button.module.scss';
import {cn} from "../utils";

export default (props) => {
    const {children, className, ...rest} = props;
    return <button className={cn(styles.button, className)} {...rest}>
        {children}
    </button>
}