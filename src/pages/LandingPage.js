import React from 'react';
import LoginButton from '../components/LoginButton';
import styles from './LandingPage.module.scss';
import Footer from "../components/Footer";
import {useSelector} from "react-redux";
import Dashboard from "../components/Dashboard";

export default () => {
    const isDataLoaded = useSelector(state => state.isDataLoaded);
    return <section className={styles.container}>
        {
            (isDataLoaded) ? <Dashboard/> : <main className={styles.main}>
                <div><h1>Spotify Data</h1></div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cupiditate fugit illo iusto mollitia
                    repellat
                    rerum tenetur, vel. Delectus ea eveniet in officia perspiciatis praesentium sed sequi vero? Aperiam,
                    aspernatur.</p>
                <LoginButton/>
            </main>
        }
        <Footer/>
    </section>;
}
