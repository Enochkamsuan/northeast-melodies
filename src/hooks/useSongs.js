import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAlbumsAsSongs } from "../lib/spotify.functions";
import { ALBUM_IDS } from "../data/albumIds";

export function useSongs() {
  const fetchSongs = useServerFn(getAlbumsAsSongs);
  const q = useQuery({
    queryKey: ["spotify", "albums", ALBUM_IDS],
    queryFn: () => fetchSongs({ data: { ids: ALBUM_IDS } }),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });


  const songs = q.data?.songs ?? [];
  return { songs, isLoading: q.isLoading, error: q.error };
}

export function useSong(songId) {
  const { songs } = useSongs();
  return songs.find((s) => String(s.id) === String(songId)) || songs[0] || null;
}
