import React, {useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from "react-router";
import Nav from "../components/Nav";
import Container from "../components/Container";
import Footer from "../components/Footer";
import StateTab from "../components/tabs/StateTab";
import styles from './DashboardPage.module.scss';
import PlaylistTab from "../components/tabs/PlaylistTab";
import ImageTab from "../components/tabs/ImageTab";
import {logout} from "../redux/actions";

export default () => {
    const isDataLoaded = useSelector(state => state.data.isDataLoaded);
    const expireDate = useSelector(state => state.data.expireDate);
    const selectedTab = useSelector(state => state.tab.selectedTab);
    const main = useRef();
    const dispatch = useDispatch();

    if (expireDate < Date.now()) {
        dispatch(logout());
    }

    let tab = null;
    switch (selectedTab) {
        case "stats":
            tab = <StateTab/>
            break;
        case "playlist":
            tab = <PlaylistTab/>
            break;
        case 'image':
            tab = <ImageTab/>
            break;
        default:
            throw new Error('Tab not found!');
    }

    if (main.current !== undefined) main.current.scrollTop = 0;

    return (isDataLoaded) ?
        <Container className={styles.container}>
            <Nav/>
            <div ref={main} className={styles.main}>
                {tab}
                <Footer/>
            </div>
        </Container> : <Redirect to='/'/>
}
