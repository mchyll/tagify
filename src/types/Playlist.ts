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
