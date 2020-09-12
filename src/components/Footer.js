import React from "react";
import styles from './Footer.module.scss';

export default () =>
    <footer className={styles.footer}>
        <span>Available on <a href='https://github.com/amiralitaheri/spotify-data' rel='noopener'>github</a></span>
        <span>Made with <span role='img' aria-label='love'>❤️ </span>by <a href='https://amiralitaheri.ir' rel='noopener'>Amirali</a></span>
    </footer>