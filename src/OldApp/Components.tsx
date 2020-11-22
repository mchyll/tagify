import React from "react";
import { IPlaylist, ITrack } from "../types/Playlist";


interface IPlaylistTableProps {
  playlists: IPlaylist[]
}
interface IPlaylistTableState {
  playlists: IPlaylistProps[]
}
export class PlaylistTable extends React.Component<IPlaylistTableProps, IPlaylistTableState> {
  state = {
    playlists: this.props.playlists.map(playlist => ({
      playlist: playlist,
      expanded: false,
      onExpandClick: (id: string) => undefined
    }))
  };

  togglePlaylistExpand = (id: string) => {
    this.setState(prevState => ({
      playlists: prevState.playlists.map(playlist => {
        if (playlist.playlist.id === id) {
          playlist.expanded = !playlist.expanded;
        }
        return playlist;
      })
    }));
  };

  render() {
    return (<>
      {this.state.playlists.map(playlist => (
        <Playlist playlist={playlist.playlist} expanded={playlist.expanded} onExpandClick={this.togglePlaylistExpand} />
      ))}
    </>);
  }
};

interface IPlaylistProps {
  playlist: IPlaylist,
  expanded: boolean,
  onExpandClick: (id: string) => void
}
const Playlist: React.FC<IPlaylistProps> = (props) => (
  <div className="playlist">
    <div className="playlist-header" onClick={() => props.onExpandClick(props.playlist.id)}>Spilleliste {props.playlist.name}</div>
    {props.expanded ? props.playlist.tracks.map(track => (
      <TrackRow track={track} />
    )) : null}
  </div>
);

interface ITrackRowProps {
  track: ITrack
}
const TrackRow: React.FC<ITrackRowProps> = (props) => (
  <div className="track">{props.track.artist} - {props.track.name}</div>
);
