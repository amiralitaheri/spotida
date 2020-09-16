import React, {useEffect} from "react";
import {login, getData} from '../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from "react-router";
import Container from "../components/Container";
import styles from './CallbackPage.module.scss';
import Card from "../components/Card";
import {parseUrl} from "../utils";

export default (props) => {
    const isDataLoaded = useSelector(state => state.data.isDataLoaded);
    const dispatch = useDispatch();

    useEffect(() => {
        const urlParameters = parseUrl(props.location.hash);
        dispatch(login(urlParameters['#access_token']));
        dispatch(getData());
    }, [dispatch, props.location.hash]);

    if (isDataLoaded === true) {
        return <Redirect to="/dashboard"/>
    }

    return <Container className={styles.container}>
        <Card className={styles.card}>
            <div className={styles.spinner}>
                <span className={styles.bounce1}/>
                <span className={styles.bounce2}/>
                <span/>
            </div>
            <h5 className={styles.text}>Stealing your data <span aria-label='cool guy' role='img'>😎</span></h5>
        </Card>
    </Container>
}