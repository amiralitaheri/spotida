export const clientId = '75f5d4538fc14160802eaf7183a4d74e';
export const scopes = ['user-top-read', 'playlist-modify-public'].join(' ');

export const addTracksToPlaylist = async (token, uris, playlistId) => {
    console.log(JSON.stringify({
        'uris': uris.slice(0, 100).join(',')
    }));
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
    if (response.status !== 201) {
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

