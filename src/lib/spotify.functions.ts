import { createServerFn } from "@tanstack/react-start";

// Spotify Web API — Albums endpoint.
// Requires SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET as runtime secrets.
// NOTE: Spotify currently requires the app owner's account to have an active
// Premium subscription for Client Credentials calls to /albums. If the token
// fetch or albums call fails, the server function throws and the UI surfaces
// an empty list (no mock fallback).

type SpotifyImage = { url: string; width: number; height: number };
type SpotifyArtist = { id: string; name: string };
type SpotifyTrack = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
};
type SpotifyAlbum = {
  id: string;
  name: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  tracks: { items: SpotifyTrack[] };
};

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET environment variables.",
    );
  }
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new Error(`Spotify token request failed [${res.status}]: ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.value;
}

async function spotifyGet<T>(path: string): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Spotify GET ${path} failed [${res.status}]: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

function pickCover(images: SpotifyImage[]): string {
  if (!images?.length) return "";
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url ?? "";
}

function trackToSong(t: SpotifyTrack, album: SpotifyAlbum) {
  return {
    id: t.id,
    title: t.name,
    artist: (t.artists ?? []).map((a) => a.name).join(", ") || album.artists?.[0]?.name || "Unknown",
    dialect: album.name,
    genre: "Album",
    mood: "Featured",
    cover: pickCover(album.images),
    previewUrl: t.preview_url,
    durationMs: t.duration_ms,
    albumId: album.id,
    albumName: album.name,
    externalUrl: t.external_urls?.spotify ?? null,
  };
}

export const getAlbum = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const album = await spotifyGet<SpotifyAlbum>(`/albums/${encodeURIComponent(data.id)}`);
    return { album };
  });

export const getAlbumsAsSongs = createServerFn({ method: "GET" })
  .inputValidator((data: { ids: string[] }) => data)
  .handler(async ({ data }) => {
    const ids = (data.ids ?? []).filter(Boolean);
    if (!ids.length) return { songs: [] };

    // Spotify allows up to 20 ids per /albums call.
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 20) chunks.push(ids.slice(i, i + 20));

    const albums: SpotifyAlbum[] = [];
    for (const chunk of chunks) {
      const res = await spotifyGet<{ albums: (SpotifyAlbum | null)[] }>(
        `/albums?ids=${chunk.map(encodeURIComponent).join(",")}`,
      );
      for (const a of res.albums) if (a) albums.push(a);
    }

    const songs = albums.flatMap((a) => (a.tracks?.items ?? []).map((t) => trackToSong(t, a)));
    return { songs };
  });
