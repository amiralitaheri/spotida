import React from "react";
import {withStyles} from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import styles from "./Slider.module.scss";

//todo: remove material dependency (create your own slider)
const CustomSlider = withStyles({
    root: {
        color: '#1ed760',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

export default React.memo((props) => {
    return <>
        <label id={props.name} className={styles.label}>{props.name}</label>
        <CustomSlider
            {...props}
        />
    </>
})