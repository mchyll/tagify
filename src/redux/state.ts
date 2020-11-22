import { IPlaylist } from "../types/Playlist";

export interface RootState {
  playlists: IPlaylist[];
  playlistsAreLoaded: boolean;
}

export const InitRootState: RootState = {
  playlists: [],
  playlistsAreLoaded: false
};
