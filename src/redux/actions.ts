import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { Services } from "../services/Services";
import { IPlaylist } from "../types/Playlist";
import { RootState } from "./state";

export const PLAYLISTS_LOADED = "PLAYLISTS_LOADED";
export const UPDATE_PLAYLIST = "UPDATE_PLAYLIST";

type PlaylistsLoadedAction = Action<typeof PLAYLISTS_LOADED> & {
  playlists: IPlaylist[]
};
type UpdatePlaylistAction = Action<typeof UPDATE_PLAYLIST> & {
  playlist: IPlaylist
};

export type AppAction = PlaylistsLoadedAction | UpdatePlaylistAction;

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, typeof Services, AppAction>;

export const playlistsLoaded = (playlists: IPlaylist[]): AppAction => ({
  type: PLAYLISTS_LOADED,
  playlists
})

export const updatePlaylist = (playlist: IPlaylist): AppAction => ({
  type: UPDATE_PLAYLIST,
  playlist
})

export const loadPlaylists = (): AppThunk => (dispatch, getState, services) => {
  if (getState().playlistsAreLoaded) {
    console.log("Playlists already loaded");
    return Promise.resolve();
  }

  return services.spotify.getPlaylists()
    .then(playlists => dispatch(playlistsLoaded(playlists)));
}

export const loadPlaylistTracks = (id: string): AppThunk => (dispatch, getState, services) => {
  const playlist = getState().playlists.find(p => p.id === id);

  if (playlist && playlist.tracksLoaded) {
    console.log(`Playlist ${id} already loaded`);
    return Promise.resolve();
  }

  return services.spotify.getPlaylist(id)
    .then(playlist => dispatch(updatePlaylist(playlist)));
}
