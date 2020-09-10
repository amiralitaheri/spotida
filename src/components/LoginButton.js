import React from 'react';
import {FaSpotify} from 'react-icons/fa';
import styles from './LoginButton.module.scss';

export default () =>
    <button className={styles.loginButton}>
        <FaSpotify/>
        Sign in with Spotify
    </button>