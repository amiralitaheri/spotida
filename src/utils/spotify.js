import {fetchToJson} from "./index";

export const clientId = 'ada67d50e3b84a28b5c7f65eb8bf1eae';
export const scopes = ['user-top-read', 'playlist-modify-public'/*, 'ugc-image-upload'*/].join(' ');

// Spotify removed the implicit grant (response_type=token), so we use the
// Authorization Code flow with PKCE, which works without a client secret.
const VERIFIER_KEY = 'spotify_code_verifier';

export const getRedirectUri = () => `${window.location.origin}/callback/`;

const base64UrlEncode = (bytes) =>
    btoa(String.fromCharCode(...new Uint8Array(bytes)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

const generateCodeVerifier = () => {
    const bytes = new Uint8Array(64);
    crypto.getRandomValues(bytes);
    return base64UrlEncode(bytes);
};

const generateCodeChallenge = async (verifier) => {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    return base64UrlEncode(digest);
};

export const redirectToAuthorize = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    window.localStorage.setItem(VERIFIER_KEY, verifier);

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: getRedirectUri(),
        scope: scopes,
        code_challenge_method: 'S256',
        code_challenge: challenge,
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// An authorization code can only be redeemed once. Cache the request per code so
// React StrictMode's double-invoked effects don't trigger a second exchange.
const tokenRequests = {};

export const exchangeCodeForToken = (code) => {
    if (!tokenRequests[code]) {
        tokenRequests[code] = (async () => {
            const verifier = window.localStorage.getItem(VERIFIER_KEY);
            if (!verifier) {
                throw new Error('Missing PKCE code verifier, please sign in again');
            }
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: getRedirectUri(),
                    code_verifier: verifier,
                }),
            });
            const json = await response.json();
            if (!response.ok) {
                throw new Error(`Token exchange failed: ${json.error_description || json.error || response.status}`);
            }
            window.localStorage.removeItem(VERIFIER_KEY);
            return json;
        })();
    }
    return tokenRequests[code];
};

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

