export const clientId = 'ada67d50e3b84a28b5c7f65eb8bf1eae';
// playlist-read-* lets the clone tool read the user's own private and collaborative playlists.
export const scopes = ['user-top-read', 'playlist-modify-public', 'playlist-read-private', 'playlist-read-collaborative'/*, 'ugc-image-upload'*/].join(' ');

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

const apiRequest = async (token, url, options = {}) => {
    const response = await fetch(url.startsWith('http') ? url : `https://api.spotify.com/v1${url}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            ...(options.body ? {'Content-Type': 'application/json'} : {}),
        },
    });
    if (!response.ok) {
        console.log(response);
        throw new Error(`Received a ${response.status} from Spotify`);
    }
    return response.json();
}

// POST /playlists/{id}/items takes at most 100 URIs per request.
export const addTracksToPlaylist = async (token, uris, playlistId) => {
    for (let i = 0; i < uris.length; i += 100) {
        await apiRequest(token, `/playlists/${playlistId}/items`, {
            method: 'POST',
            body: JSON.stringify({uris: uris.slice(i, i + 100)}),
        });
    }
}

// POST /users/{user_id}/playlists was removed in favour of POST /me/playlists.
export const createPlaylist = (token, body) =>
    apiRequest(token, '/me/playlists', {method: 'POST', body});

// GET /artists/{id}/top-tracks was removed. Search for the artist's tracks instead
// (search returns at most 10 results) and keep only tracks credited to that artist.
export const getArtistTracks = async (token, artist, limit = 5) => {
    const params = new URLSearchParams({
        q: `artist:"${artist.name.replace(/"/g, '')}"`,
        type: 'track',
        limit: '10',
    });
    const response = await apiRequest(token, `/search?${params.toString()}`);
    return response.tracks.items
        .filter(track => track && track.artists.some(a => a.id === artist.id))
        .slice(0, limit);
}

// Playlist objects renamed `tracks` -> `items` and `track` -> `item`; read either.
// `items` is only returned for playlists the user owns or collaborates on.
export const getPlaylistPage = (playlist) => playlist.items || playlist.tracks || null;

const getEntryUris = (page) => page.items
    .map(entry => entry.item || entry.track)
    .filter(item => item && item.uri && !item.uri.startsWith('spotify:local:'))
    .map(item => item.uri);

export const clonePlaylist = async (token, playlist) => {
    let page = getPlaylistPage(playlist);
    if (!page || !Array.isArray(page.items)) {
        throw new Error('Spotify only lets Spotida read playlists you own or collaborate on.');
    }

    const uris = getEntryUris(page);
    while (page.next) {
        page = await apiRequest(token, page.next);
        uris.push(...getEntryUris(page));
    }

    const clone = await createPlaylist(token, JSON.stringify({
        name: `${playlist.name} clone ${(new Date()).toLocaleDateString("en-US")}`,
        description: `${playlist.description || ''} cloned by Spotida`.trim(),
    }));
    await addTracksToPlaylist(token, uris, clone.id);
    return clone;
}
