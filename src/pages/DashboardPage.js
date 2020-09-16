import React from "react";
import {useSelector} from 'react-redux';
import {Redirect} from "react-router";
import Nav from "../components/Nav";
import Container from "../components/Container";
import Footer from "../components/Footer";
import StateTab from "../components/Tabs/StateTab";
import styles from './DashboardPage.module.scss';
import PlaylistTab from "../components/Tabs/PlaylistTab";
import ImageTab from "../components/Tabs/ImageTab";
import HelpUsTab from "../components/Tabs/HelpUsTab";

export default () => {
    const isDataLoaded = useSelector(state => state.data.isDataLoaded);
    const selectedTab = useSelector(state => state.tab.selectedTab);
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
        case 'help':
            tab = <HelpUsTab/>
            break;
        default:
            throw new Error('Tab not found!');
    }
    return (isDataLoaded) ?
        <Container className={styles.container}>
            <Nav/>
            <div className={styles.main}>
                {tab}
                <Footer/>
            </div>
        </Container> : <Redirect to='/'/>
}
