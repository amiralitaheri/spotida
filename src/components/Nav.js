import React, {useCallback} from "react";
import styles from './Nav.module.scss';
import {BiStats, BiImage, BiLogOut} from 'react-icons/bi';
import {FaHandsHelping} from 'react-icons/fa';
import {RiPlayListFill} from 'react-icons/ri';
import {useDispatch, useSelector} from "react-redux";
import {changeTab, logout} from "../redux/actions";
import {cn} from "../utils";
import Tooltip from '@material-ui/core/Tooltip';

export default () => {
    const dispatch = useDispatch();
    const selectedTab = useSelector(state => state.tab.selectedTab);

    return <nav className={styles.nav}>
        <ul className={styles.ul}>
            <li id={cn(selectedTab === 'stats' && styles.selected)}>
                <Tooltip title="Statistics" placement="right">
                    <button className={styles.button} onClick={useCallback(() => dispatch(changeTab('stats')), [])}>
                        <BiStats/>
                    </button>
                </Tooltip>
            </li>
            <li id={cn(selectedTab === 'playlist' && styles.selected)}>
                <Tooltip title="Playlist Creator" placement="right">
                    <button className={styles.button} onClick={useCallback(() => dispatch(changeTab('playlist')), [])}>
                        <RiPlayListFill/>
                    </button>
                </Tooltip>
            </li>
            <li id={cn(selectedTab === 'image' && styles.selected)}>
                <Tooltip title="Image Creator" placement="right">
                    <button className={styles.button} onClick={useCallback(() => dispatch(changeTab('image')), [])}>
                        <BiImage/>
                    </button>
                </Tooltip>
            </li>
            <li id={cn(selectedTab === 'help' && styles.selected)}>
                <Tooltip title="Help Us" placement="right">
                    <button className={styles.button} onClick={useCallback(() => dispatch(changeTab('help')), [])}>
                        <FaHandsHelping/>
                    </button>
                </Tooltip>
            </li>
        </ul>
        <Tooltip title="Logout" placement="right">
            <button className={cn(styles.logout, styles.button)} onClick={useCallback(() => dispatch(logout()), [])}>
                <BiLogOut/>
            </button>
        </Tooltip>
    </nav>
}