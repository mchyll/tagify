import { ADD_TRACK_TAG, AppAction, PLAYLISTS_LOADED, SET_CURRENT_USER, UPDATE_PLAYLIST } from "./actions";
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

    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.user
      };

    case ADD_TRACK_TAG:
      const newTags = [...state.trackTags[action.trackId] ?? []];
      if (!newTags.find(t => t.id === action.tag.id)) {
        newTags.push(action.tag);
      }
      return {
        ...state,
        trackTags: {
          ...state.trackTags,
          [action.trackId]: newTags
        }
      };

    default:
      return state;
  }
}

export default RootReducer;
