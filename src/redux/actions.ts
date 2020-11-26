import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { Services } from "../services/Services";
import { Playlist, Tag, User } from "../types/Types";
import { RootState } from "./state";

export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const PLAYLISTS_LOADED = "PLAYLISTS_LOADED";
export const UPDATE_PLAYLIST = "UPDATE_PLAYLIST";
export const ADD_TRACK_TAG = "ADD_TRACK_TAG";

type SetCurrentUserAction = Action<typeof SET_CURRENT_USER> & {
  user: User
};
type PlaylistsLoadedAction = Action<typeof PLAYLISTS_LOADED> & {
  playlists: Playlist[]
};
type UpdatePlaylistAction = Action<typeof UPDATE_PLAYLIST> & {
  playlist: Playlist
};
type AddTrackTagAction = Action<typeof ADD_TRACK_TAG> & {
  trackId: string,
  tag: Tag
};

export type AppAction = SetCurrentUserAction | PlaylistsLoadedAction | UpdatePlaylistAction | AddTrackTagAction;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, typeof Services, AppAction>;

export const playlistsLoaded = (playlists: Playlist[]): AppAction => ({
  type: PLAYLISTS_LOADED,
  playlists
})

export const updatePlaylist = (playlist: Playlist): AppAction => ({
  type: UPDATE_PLAYLIST,
  playlist
})

export const setCurrentUser = (user: User): AppAction => ({
  type: SET_CURRENT_USER,
  user
})

export const addTrackTag = (trackId: string, tag: Tag): AppAction => ({
  type: ADD_TRACK_TAG,
  trackId,
  tag
})

export const loadCurrentUser = (): AppThunk => (dispatch, getState, services) => {
  if (getState().user) {
    return Promise.resolve();
  }

  return services.spotify.getCurrentUser()
    .then(user => dispatch(setCurrentUser(user)))
    .catch(handleError);
}

export const loadPlaylists = (): AppThunk => (dispatch, getState, services) => {
  if (getState().playlistsAreLoaded) {
    console.log("Playlists already loaded");
    return Promise.resolve();
  }

  return services.spotify.getPlaylists()
    .then(playlists => dispatch(playlistsLoaded(playlists)))
    .catch(handleError);
}

export const loadPlaylistTracks = (id: string): AppThunk => (dispatch, getState, services) => {
  const playlist = getState().playlists.find(p => p.id === id);

  if (playlist && playlist.tracksLoaded) {
    console.log(`Playlist ${id} already loaded`);
    return Promise.resolve();
  }

  return services.spotify.getPlaylist(id)
    .then(playlist => dispatch(updatePlaylist(playlist)))
    .catch(handleError);
}

function handleError(error: any) {
  console.error("Oops:", error);
}
