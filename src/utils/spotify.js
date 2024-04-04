import {fetchToJson} from "./index";

export const clientId = 'ada67d50e3b84a28b5c7f65eb8bf1eae';
export const scopes = ['user-top-read', 'playlist-modify-public'/*, 'ugc-image-upload'*/].join(' ');

export const addTracksToPlaylist = async (token, uris, playlistId) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            uris: uris.slice(0, 100)
        })
    })
    if (response.status !== 200 && response.status !== 201) {
        console.log(response);
        throw new Error(`Received a ${response.status} from Spotify`);
    }
    return response.json();
}

export const createPlaylist = async (token, userId, body) => {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: body,
    });
    if (response.status !== 200 && response.status !== 201) {
        console.log(response);
        throw new Error(`Received a ${response.status} from Spotify`);
    }
    return response.json();
}

export const getArtistTopTracks = async (token, artistID) => {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=from_token`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });
    if (response.status !== 200 && response.status !== 201) {
        console.log(response);
        throw new Error(`Received a ${response.status} from Spotify`);
    }
    return response.json();
}

export const clonePlaylist = async (token, userId, playlist) => {
    //create playlist
    const clone = await createPlaylist(token, userId, JSON.stringify({
        'name': `${playlist.name} clone ${(new Date()).toLocaleDateString("en-US")}`,
        'description': `${playlist.description} cloned by Spotida`
    }));

    //set image
    // const image = await fetch(playlist.images[0].url);
    // const blob = await image.blob();
    // const reader = new FileReader();
    // reader.onload = () => {
    //     fetch(`https://api.spotify.com/v1/playlists/${clone.id}/images`, {
    //         method: 'put',
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Accept': 'application/json',
    //             'Content-Type': 'image/jpeg',
    //         },
    //         body: reader.result
    //     })
    // };
    // reader.readAsDataURL(blob);

    //add tracks
    await addTracksToPlaylist(token, playlist.tracks.items.map(item => item.track.uri), clone.id);
    let tracks = playlist.tracks;
    while (tracks.next != null) {
        tracks = await fetch(tracks.next, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(fetchToJson);
        await addTracksToPlaylist(token, tracks.items.map(item => item.track.uri), clone.id);
    }

    return clone;
}

