import { Playlist, Tag, TrackTagMap } from "../types/Types";


export interface RootState {
  playlists: Playlist[];
  playlistsAreLoaded: boolean;
  user?: SpotifyApi.UserObjectPrivate;
  tags: Tag[];
  trackTags: TrackTagMap;
}

export const InitRootState: RootState = {
  playlists: [],
  playlistsAreLoaded: false,
  tags: [],
  trackTags: {}
};
