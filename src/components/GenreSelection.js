import React, {useRef} from "react";
import styles from './GenreSelection.module.scss';
import {cn} from "../utils";
import {useSelector} from "react-redux";
import Button from "./Button";

export default React.memo((props) => {
    const genres = useSelector(state => state.data.genres);
    const textField = useRef();

    const add = event => {
        event.preventDefault();
        if (genres.includes(textField.current.value) && props.value.length < 6) {
            props.onChange([...props.value, textField.current.value]);
            textField.current.value = ''
        }
    }

    const remove = (event, key) => {
        event.preventDefault();
        const temp = [...props.value]
        temp.splice(props.value.findIndex(g => g === key), 1);
        props.onChange(temp);
    }

    return <>
        <span className={styles.hint}>Tap to remove</span>
        <div className={cn(props.className, styles.container)}>
            <ul className={styles.tags}>{props.value.map(genre => <li key={genre}
                                                                      tabIndex={0}
                                                                      onClick={event => remove(event, genre)}>
                <span>{genre}</span></li>)}</ul>
            <input ref={textField} list='genres' className={styles.input}/>
            <Button className={styles.button} onClick={add}>Add</Button>
            <datalist id='genres'>
                {genres.map(genre => <option key={genre} value={genre}/>)}
            </datalist>
        </div>
    </>
})