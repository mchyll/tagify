import React from "react";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import RootReducer from "./redux/reducer";
import "semantic-ui-css/semantic.min.css";
import AllPlaylistsPage from "./components/AllPlaylistsPage";
import PlaylistPage from "./components/PlaylistPage";
import { HomePage } from "./components/HomePage";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk, { ThunkDispatch } from "redux-thunk";
import { Services } from "./services/Services";
import { AppAction, loadCurrentUser, loadPlaylists } from "./redux/actions";
import { RootState } from "./redux/state";
import { Container } from "semantic-ui-react";
import { AppMenu } from "./components/AppMenu";
import TagsPage from "./components/TagPage";


const store = createStore(RootReducer, composeWithDevTools(applyMiddleware(thunk.withExtraArgument(Services))));
const thunkDispath = store.dispatch as ThunkDispatch<RootState, typeof Services, AppAction>;
thunkDispath(loadCurrentUser());
// thunkDispath(loadPlaylists());

const App = () =>
  <Provider store={store}>
    <BrowserRouter>
      <Container>
        <AppMenu />
        <Switch>
          <Route path="/playlists/:id" component={PlaylistPage} />
          <Route path="/playlists" exact component={AllPlaylistsPage} />
          <Route path="/tags/:id" exact component={TagsPage} />
          <Route path="/tags" exact component={TagsPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Container>
    </BrowserRouter>
  </Provider>

export default App;
