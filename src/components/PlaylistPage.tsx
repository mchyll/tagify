import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Container, Segment, Table } from "semantic-ui-react";
import { RootState } from "../redux/state";
import { loadPlaylistTracks } from "../redux/actions";


interface PlaylistPageParams {
  id: string
}

const connector = connect((state: RootState, ownProps: RouteComponentProps<PlaylistPageParams>) => ({
  playlist: state.playlists.find(p => p.id === ownProps.match.params.id)
}), { loadPlaylistTracks });


const PlaylistPage = (props: RouteComponentProps<PlaylistPageParams> & ConnectedProps<typeof connector>) => {
  useEffect(() => {
    // Loads the tracks of this playlist, if not already existing in redux state
    props.loadPlaylistTracks(props.match.params.id);
  });

  if (!props.playlist) {
    return <Container>
      <Segment color="red">
        Playlist not found
      </Segment>
    </Container>
  }

  return <>
    <Container>
      <h1>{props.playlist.name}</h1>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Navn</Table.HeaderCell>
            <Table.HeaderCell>Artist</Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.playlist.tracks.map((t, i) =>
            <Table.Row key={`${t.id}_${i}`}>
              <Table.Cell>{t.name}</Table.Cell>
              <Table.Cell>{t.artist}</Table.Cell>
              <Table.Cell>{t.id}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Container>
  </>
}

export default connector(PlaylistPage);
