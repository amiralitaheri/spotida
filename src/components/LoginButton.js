import React from 'react';
import {FaSpotify} from 'react-icons/fa';
import styles from './LoginButton.module.scss';
import * as Spotify from '../spotify';

export default () =>
    <button className={styles.loginButton} onClick={event=>{
        event.preventDefault();
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${Spotify.clientId}&redirect_uri=${window.location}callback/&scope=${Spotify.scopes}&response_type=token`;
    }}>
        <FaSpotify/>
        Sign in with Spotify
    </button>