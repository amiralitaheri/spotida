import React from 'react';
import {FaSpotify} from 'react-icons/fa';
import styles from './LoginButton.module.scss';
import * as Spotify from '../utils/spotify';

export default () =>
    <button className={styles.loginButton} onClick={event => {
        event.preventDefault();
        Spotify.redirectToAuthorize();
    }}>
        <FaSpotify/>
        Sign in with Spotify
    </button>
