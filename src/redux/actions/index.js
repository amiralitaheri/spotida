export const login = (token) => ({
    type: 'LOGIN',
    payload: {
        token
    }
})

export const saveDate = (data) => ({
    type: 'SAVE_DATA',
    payload: data
})

export const getData = () => (dispatch, getState) => {
    const {token} = getState();
    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    };

    Promise.all([
            fetch('https://api.spotify.com/v1/me', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', options).then(response => response.json()),
        ]
    ).then(([me, artistsS, artistsM, artistsL, tracksS, tracksM, tracksL]) => {
        dispatch(saveDate({me, artistsS, artistsM, artistsL, tracksS, tracksM, tracksL, token}));
    }).catch((err) => {
        console.log(err);
    });


}



