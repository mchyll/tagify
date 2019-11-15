import React from 'react';

interface IPlaylistTable {
  playlists: IPlaylistProps[]
};
export class PlaylistTable extends React.Component<IPlaylistTable, IPlaylistTable> {
  state = {
    playlists: this.props.playlists
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

interface IPlaylist {
  id: string,
  name: string,
  tracks: ITrack[]
};
interface IPlaylistProps {
  playlist: IPlaylist,
  expanded: boolean,
  onExpandClick: (id: string) => void
};
const Playlist: React.FC<IPlaylistProps> = (props) => {
  return (
    <div className="playlist">
      <div className="playlist-header" onClick={() => props.onExpandClick(props.playlist.id)}>Spilleliste {props.playlist.name}</div>
      {props.expanded ? props.playlist.tracks.map(track => (
        <TrackRow track={track} />
      )) : null}
    </div>
  );
};

interface IRow { id: number, name: string, crossed?: boolean };
interface IRowClickable { onClick: (id: number) => void };
interface ITrack {
  id: string,
  name: string,
  artist: string
};
const TrackRow: React.FC<{ track: ITrack }> = (props) => {
  return (
    <div className="track">{props.track.artist} - {props.track.name}</div>
  );
};
