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
import thunk from "redux-thunk";
import { Services } from "./services/Services";


const store = createStore(RootReducer, composeWithDevTools(applyMiddleware(thunk.withExtraArgument(Services))));

const App = () =>
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/playlist/:id" component={PlaylistPage} />
        <Route path="/playlists" component={AllPlaylistsPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </BrowserRouter>
  </Provider>

export default App;
