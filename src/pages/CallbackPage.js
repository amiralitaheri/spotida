import React, {useEffect} from "react";
import {login, getData} from '../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from "react-router";

export default (props) => {
    const isDataLoaded = useSelector(state => state.isDataLoaded);
    const dispatch = useDispatch();

    useEffect(() => {
        let token = props.location.hash.match(/access_token=(.*?)&/g)[0];
        token = token.substring(13, token.length - 1);
        dispatch(login(token));
        dispatch(getData());
    }, []);

    if (isDataLoaded === true) {
        return <Redirect to="/"/>
    }

    return <h1>Loading...</h1>
}