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

export const getLeastPopular = (list) => {
    let result = null;
    let resultPopularity = 100;
    list.items.forEach(item => {
        if (item.popularity < resultPopularity) {
            resultPopularity = item.popularity;
            result = item;
        }
    });
    return result;
};

export const getAverageFromAudioFeatures = (audioFeatures) => {
    const average = {
        danceability: 0.0,
        energy: 0.0,
        loudness: 0.0,
        speechiness: 0.0,
        acousticness: 0.0,
        instrumentalness: 0.0,
        liveness: 0.0,
        valence: 0.0,
        tempo: 0.0,
        duration_ms: 0.0,
    };
    audioFeatures.forEach(af => {
        Object.keys(average).forEach(key => {
            average[key] += af[key]
        })
    })
    Object.keys(average).forEach(key => {
        average[key] /= audioFeatures.length;
    })
    return average;
}
export const getTrackIds = (listTracks) => {
    const result = new Set();
    listTracks.forEach(list => {
        list.items.forEach(track => {
            result.add(track.id);
        })
    });
    return Array.from(result);
}
export const calculateTopGenres = (listArtists) => {
    const topGenres = {}
    listArtists.forEach(list => {
        list.items.forEach(artist => {
            artist.genres.forEach(genre => {
                if (genre in topGenres) {
                    topGenres[genre] += 1;
                } else {
                    topGenres[genre] = 1;
                }
            })
        })
    });
    const items = Object.keys(topGenres).map(function (key) {
        return [key, topGenres[key]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    const result = []
    const others = ['others', 0]
    items.forEach(item => {
        if (item[1] > 10 && result.length < 7) {
            result.push(item);
        } else {
            others[1] += item[1];
        }
    })
    result.push(others)
    return result;
}

export * from './data';
export * from './sampleData';