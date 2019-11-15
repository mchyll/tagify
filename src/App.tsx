import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PlaylistTable } from './Components';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
      <Table />
      <PlaylistTable playlists={[
        {
          expanded: false,
          playlist: {
            id: "1237jhb3jhbv",
            name: "Min spilleliste 😍👌",
            tracks: [
              {
                id: "lolsang1",
                artist: "The impala",
                name: "Det er jul igjen"
              }
            ]
          },
          onExpandClick: () => {}
        }
      ]} />
    </div>
  );
}

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
const Row: React.FC<IRow & IRowClickable> = (props) => {
  if (props.crossed) {
    return (
      <div className="lol" onClick={() => props.onClick(props.id)}><del>Rad {props.name}</del></div>
    );
  }
  else {
    return (
      <div className="lol" onClick={() => props.onClick(props.id)}>Rad {props.name}</div>
    );
  }
}

export default App;
