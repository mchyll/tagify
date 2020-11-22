import { AppAction, PLAYLISTS_LOADED, UPDATE_PLAYLIST } from "./actions";
import { InitRootState, RootState } from "./state";


const RootReducer = (state: RootState = InitRootState, action: AppAction): RootState => {
  console.log("Reducer got action", action.type);

  switch (action.type) {

    case PLAYLISTS_LOADED:
      return {
        ...state,
        playlists: action.playlists,
        playlistsAreLoaded: true
      };

    case UPDATE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.find(p => p.id === action.playlist.id) ?
          state.playlists.map(p => p.id === action.playlist.id ? action.playlist : p) :
          [...state.playlists, action.playlist]
      };

    default:
      return state;
  }
}

export default RootReducer;
