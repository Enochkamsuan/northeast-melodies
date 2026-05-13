import { createServerFn } from "@tanstack/react-start";

// We keep the file/exports named "spotify"/"getAlbumsAsSongs" to avoid touching
// every consumer, but under the hood we use the free iTunes Search API.
// No API key, no premium account required.
//
// Docs: https://performance-partners.apple.com/search-api

type ItunesTrack = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  collectionId: number;
  artworkUrl100?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  primaryGenreName?: string;
  trackViewUrl?: string;
};

async function itunesSearch(term: string, limit = 25): Promise<ItunesTrack[]> {
  const url = `https://itunes.apple.com/search?media=music&entity=song&limit=${limit}&term=${encodeURIComponent(term)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`iTunes search failed [${res.status}]`);
  const json = (await res.json()) as { results: ItunesTrack[] };
  return json.results ?? [];
}

function toSong(t: ItunesTrack, dialect: string) {
  const cover = (t.artworkUrl100 ?? "").replace("100x100", "600x600");
  return {
    id: String(t.trackId),
    title: t.trackName,
    artist: t.artistName,
    dialect,
    genre: t.primaryGenreName ?? "Album",
    mood: "Featured",
    cover,
    previewUrl: t.previewUrl ?? null,
    durationMs: t.trackTimeMillis ?? 0,
    albumId: String(t.collectionId),
    albumName: t.collectionName,
    externalUrl: t.trackViewUrl ?? null,
  };
}

// Northeast India search terms — feel free to edit this list.
const SEARCH_TERMS: { term: string; dialect: string }[] = [
  { term: "manipuri song", dialect: "Manipuri" },
  { term: "assamese song", dialect: "Assamese" },
  { term: "naga song", dialect: "Naga" },
  { term: "mizo song", dialect: "Mizo" },
  { term: "khasi song", dialect: "Khasi" },
];

export const getAlbumsAsSongs = createServerFn({ method: "GET" })
  .inputValidator((data: { ids?: string[] }) => data)
  .handler(async () => {
    const batches = await Promise.all(
      SEARCH_TERMS.map(async ({ term, dialect }) => {
        try {
          const tracks = await itunesSearch(term, 10);
          return tracks.map((t) => toSong(t, dialect));
        } catch {
          return [];
        }
      }),
    );

    const seen = new Set<string>();
    const songs = batches.flat().filter((s) => {
      if (!s.id || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });

    return { songs };
  });

// Kept for API parity; not used by the UI.
export const getAlbum = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(data.id)}&entity=song`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`iTunes lookup failed [${res.status}]`);
    return res.json();
  });
