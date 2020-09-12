import React from "react";
import {useSelector} from 'react-redux';
import {Redirect} from "react-router";
import Nav from "../components/Nav";
import Container from "../components/Container";
import Footer from "../components/Footer";
import StateTab from "../components/StateTab";
import styles from './DashboardPage.module.scss';

export default () => {
    const isDataLoaded = useSelector(state => state.data.isDataLoaded);
    return (isDataLoaded) ?
        <Container className={styles.container}>
            <Nav/>
            <div className={styles.main}>
                <StateTab/>
                <Footer/>
            </div>
        </Container> : <Redirect to='/'/>
}
