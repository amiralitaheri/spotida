import React from 'react';
import LoginButton from '../components/LoginButton';
import styles from './LandingPage.module.scss';
import Footer from "../components/Footer";
import Card from "../components/Card";
import Container from "../components/Container";
import {useSelector} from "react-redux";
import {Redirect} from "react-router";

export default () => {
    const isDataLoaded = useSelector(state => state.data.isDataLoaded);
    const isExpired = useSelector(state => state.data.expireDate < Date.now());
    if (isDataLoaded === true && !isExpired) {
        return <Redirect to="/dashboard"/>
    }
    return <Container className={styles.container}>
        <main className={styles.main}>
            <Card className={styles.card}>
                <div className={styles.logo}><h1><span>S</span>poti<span>da</span></h1></div>
                <p>As recently I have noticed that Spotify.me no longer works <span aria-label='sad'
                                                                                    role='img'>😭</span>.
                    I needed a place to see my Spotify statistics. So I have created this website and added some other
                    tools such as playlist creator.
                </p>
                <p>
                    We take your privacy very seriously and won't store any of your data, but if you enjoyed using this
                    website, consider helping the OpenSource community by sharing your data. More info is available in
                    the "Help US Tab" in the dashboard.
                </p>
                <p>
                    If you are a developer feel free to contribute to the github repository, any new features or
                    improvements are welcomed.
                </p>
                <LoginButton/>
            </Card>
        </main>
        <Footer/>
    </Container>;
}
