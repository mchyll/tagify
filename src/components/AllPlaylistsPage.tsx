import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Container, Table } from "semantic-ui-react";
import { loadPlaylists } from "../redux/actions";
import { RootState } from "../redux/state";
import "./AllPlaylistsPage.scss";


const connector = connect((state: RootState) => ({
  playlists: state.playlists,
}), { loadPlaylists });

const AllPlaylistsPage = (props: RouteComponentProps & ConnectedProps<typeof connector>) => {
  useEffect(() => {
    props.loadPlaylists();
  }, []);

  return <>
    <Container>
      <h1>Spillelister</h1>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Navn</Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.playlists.map(p =>
            <Table.Row key={p.id} positive={p.tracksLoaded} className="playlist-item" onClick={() => props.history.push(`/playlist/${p.id}`)}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.id}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Container>
  </>
}

export default connector(AllPlaylistsPage);
