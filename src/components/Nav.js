import React, {useCallback} from "react";
import styles from './Nav.module.scss';
import {BiStats, BiImage, BiLogOut} from 'react-icons/bi';
import {FaHandsHelping} from 'react-icons/fa';
import {RiPlayListFill} from 'react-icons/ri';
import {useDispatch, useSelector} from "react-redux";
import {changeTab, logout} from "../redux/actions";
import {cn} from "../utils";

export default () => {
    const dispatch = useDispatch();
    const selectedTab = useSelector(state => state.tab.selectedTab);

    return <nav className={styles.nav}>
        <ul className={styles.ul}>
            <li id={cn(selectedTab === 'stats' && styles.selected)}>
                <button className={styles.button} onClick={useCallback(() => dispatch(changeTab('stats')), [])}>
                    <BiStats/></button>
            </li>
            <li id={cn(selectedTab === 'playlist' && styles.selected)}>
                <button className={styles.button} onClick={useCallback(() => dispatch(changeTab('playlist')), [])}>
                    <RiPlayListFill/></button>
            </li>
            <li id={cn(selectedTab === 'image' && styles.selected)}>
                <button className={styles.button} onClick={useCallback(() => dispatch(changeTab('image')), [])}>
                    <BiImage/></button>
            </li>
            <li id={cn(selectedTab === 'help' && styles.selected)}>
                <button className={styles.button} onClick={useCallback(() => dispatch(changeTab('help')), [])}>
                    <FaHandsHelping/></button>
            </li>
        </ul>
        <button className={cn(styles.logout, styles.button)} onClick={useCallback(() => dispatch(logout()), [])}>
            <BiLogOut/></button>
    </nav>
}