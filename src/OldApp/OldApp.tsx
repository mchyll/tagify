import React from 'react';
import logo from './logo.svg';
import './OldApp.css';
import { PlaylistTable } from './Components';
import SpotifyService from '../services/SpotifyService';
import { IAuthService } from '../services/AuthService';


const spotifyService = new SpotifyService({} as IAuthService);

const OldApp: React.FC = () => (
  <div className="App">
    <PlaylistTable playlists={spotifyService.getPlaylists()} />
  </div>
);

interface ITableProps { };
interface ITableState {
  rows: IRow[]
};
class Table extends React.Component<ITableProps, ITableState> {
  constructor(props: ITableProps) {
    super(props);
    this.state = {
      rows: [
        { id: 1, name: "Magnus", crossed: true },
        { id: 2, name: "Conrad", crossed: false },
        { id: 3, name: "Hyll", crossed: false },
        { id: 4, name: "Magnus", crossed: false }
      ]
    };
  }

  onRowClick = (id: number) => {
    this.setState(prevState => ({
      rows: prevState.rows.map(row => {
        if (row.id === id) {
          row.crossed = !row.crossed;
        }
        return row;
      })
    }));
  }

  render() {
    return (
      <div>{this.state.rows.map(row => (
        <Row key={row.id} id={row.id} name={row.name} crossed={row.crossed} onClick={this.onRowClick} />
      ))}</div>
    );
  }
}

interface IRow { id: number, name: string, crossed?: boolean };
interface IRowClickable { onClick: (id: number) => void };
const Row: React.FC<IRow & IRowClickable> = (props) => (
  props.crossed ?
    (<div className="lol" onClick={() => props.onClick(props.id)}><del>Rad {props.name}</del></div>) :
    (<div className="lol" onClick={() => props.onClick(props.id)}>Rad {props.name}</div>)
);

export default OldApp;
