import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Button, Container, Segment } from "semantic-ui-react";
import { auth } from "../services/Services";


export const HomePage = (props: RouteComponentProps) => {
  const [isAuthorized, setIsAuthorized] = useState(auth.isAuthorized());

  useEffect(() => {
    auth.onAuthorized.subscribe(() => setIsAuthorized(auth.isAuthorized()));
  }, []);

  return <Container text>
    <div style={{ wordWrap: "break-word" }}>
      <Segment>
        {isAuthorized ?
          <Redirect to="/playlists" /> :
          <Button onClick={() => auth.authorizeRedirect()}>Logg inn med Spotify</Button>
        }
      </Segment>
    </div>
  </Container>
}

export const _HomePage = (props: RouteComponentProps) => {
  const auth = useAuth0();

  if (auth.isLoading) {
    return <Segment>Loading...</Segment>;
  }

  if (auth.error) {
    return <Segment inverted color="red">Oops... {auth.error.message}</Segment>;
  }

  if (auth.isAuthenticated) {
    return <Redirect to="/playlists" />
  }

  return <Segment><Button primary onClick={() => auth.loginWithRedirect()}>Logg inn med Spotify</Button></Segment>
}
