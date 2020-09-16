import {useEffect, useRef} from "react";

export function cn(...args) {
    return args.filter(Boolean).join(' ')
}

export const useTraceUpdate = (props) => {
    const prev = useRef(props);
    useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log('Changed props:', changedProps);
        }
        prev.current = props;
    });
}

export const parseUrl = (parameters) => {
    let result = {}
    parameters.split('&').forEach(parameter => {
        const sp = parameter.split('=');
        result[sp[0]] = sp[1];
    })
    return result;
}

export * from './data';