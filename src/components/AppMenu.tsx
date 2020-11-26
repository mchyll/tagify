import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export const AppMenu = () =>
<Menu>
  <Menu.Item><Link to="/playlists">Alle spillelister</Link></Menu.Item>
  <Menu.Item><Link to="/tags">Alle tags</Link></Menu.Item>
</Menu>
