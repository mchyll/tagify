export type User = SpotifyApi.UserObjectPrivate;

export type Track = SpotifyApi.TrackObjectFull & Omit<SpotifyApi.PlaylistTrackObject, "track"> & {
  artist: string
};
export type Playlist = Omit<SpotifyApi.PlaylistBaseObject, "tracks"> & {
  tracks: Track[],
  tracksLoaded: boolean
};

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type TrackTagMap = {
  [trackId: string]: Tag[];
}

export interface ITrack {
    id: string,
    name: string,
    artist: string
};

export interface IPlaylist {
    id: string,
    name: string,
    tracks: ITrack[],
    tracksLoaded: boolean
};
