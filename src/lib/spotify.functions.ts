import { createServerFn } from "@tanstack/react-start";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET");

  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token error [${res.status}]: ${text}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.value;
}

async function spotifyGet(path: string) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify GET ${path} failed [${res.status}]: ${text}`);
  }
  return res.json();
}

// Fetch a single album: https://api.spotify.com/v1/albums/{id}
export const getAlbum = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return spotifyGet(`/albums/${encodeURIComponent(data.id)}`);
  });

// Fetch many albums and flatten into a single song list compatible with the UI
export const getAlbumsAsSongs = createServerFn({ method: "GET" })
  .inputValidator((data: { ids: string[] }) => data)
  .handler(async ({ data }) => {
    if (!data.ids?.length) return { songs: [] };

    // Spotify allows up to 20 ids per /albums?ids=
    const chunks: string[][] = [];
    for (let i = 0; i < data.ids.length; i += 20) chunks.push(data.ids.slice(i, i + 20));

    const albums: any[] = [];
    for (const chunk of chunks) {
      const json: any = await spotifyGet(`/albums?ids=${chunk.map(encodeURIComponent).join(",")}`);
      if (json?.albums) albums.push(...json.albums.filter(Boolean));
    }

    const songs = albums.flatMap((album: any) => {
      const cover = album.images?.[0]?.url ?? "";
      return (album.tracks?.items ?? []).map((t: any) => ({
        id: t.id,
        title: t.name,
        artist: (t.artists ?? []).map((a: any) => a.name).join(", "),
        dialect: album.label ?? "Northeast",
        genre: (album.genres && album.genres[0]) || "Album",
        mood: "Featured",
        cover,
        previewUrl: t.preview_url ?? null,
        durationMs: t.duration_ms ?? 0,
        albumId: album.id,
        albumName: album.name,
        externalUrl: t.external_urls?.spotify ?? null,
      }));
    });

    return { songs };
  });
