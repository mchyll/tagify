import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Button, Container, Label, Segment, Table } from "semantic-ui-react";
import { RootState } from "../redux/state";
import { addTrackTag, loadPlaylistTracks } from "../redux/actions";


interface PlaylistPageParams {
  id: string
}

const connector = connect((state: RootState, ownProps: RouteComponentProps<PlaylistPageParams>) => ({
  playlist: state.playlists.find(p => p.id === ownProps.match.params.id),
  tags: state.trackTags
}), {
  loadPlaylistTracks,
  addTrackTag
});

const formatDate = (timestamp: number | string) => {
  const d = new Date(timestamp);
  return `${d.getFullYear()}.${d.getMonth()}.${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

const PlaylistPage = (props: RouteComponentProps<PlaylistPageParams> & ConnectedProps<typeof connector>) => {
  useEffect(() => {
    // Loads the tracks of this playlist, if not already existing in redux state
    props.loadPlaylistTracks(props.match.params.id);
  });

  if (!props.playlist) {
    return <Segment color="red">Playlist not found</Segment>
  }

  if (!props.playlist.tracksLoaded) {
    return <>
      <h1>{props.playlist.name}</h1>
      <Segment>Loading...</Segment>
    </>
  }

  console.log("Tags:", props.tags);

  return <>
    <h1>{props.playlist.name}</h1>
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          <Table.HeaderCell>Artist</Table.HeaderCell>
          <Table.HeaderCell>Tags</Table.HeaderCell>
          <Table.HeaderCell>Lagt til</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.playlist.tracks.map((t, i) =>
          <Table.Row key={i}>
            <Table.Cell>{t.name}</Table.Cell>
            <Table.Cell>{t.artist}</Table.Cell>
            <Table.Cell>
              {props.tags[t.id]?.map((t, i) =>
                <Label key={i} tag color={t.color as any}>{t.name}</Label>
              )}
              <Button onClick={() => props.addTrackTag(t.id, { color: "red", id: "cool", name: "Cool song" })}>Legg til tag</Button>
            </Table.Cell>
            <Table.Cell>{new Date(t.added_at).toLocaleString()}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </>
}

export default connector(PlaylistPage);
