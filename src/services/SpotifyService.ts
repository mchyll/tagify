import { IPlaylist, ITrack, Playlist } from "../types/Types";
import { IAuthService } from "./AuthService";


const API_BASE_URL = "https://api.spotify.com/v1/";

export default class SpotifyService {

  constructor(private authService: IAuthService) {
    authService.onAuthorized.subscribe(() => {
      console.log("SpotifyService was notified that AuthService successfully has authorized");
    });
  }

  private async callEndpoint<T>(path: string, requestInit?: RequestInit): Promise<T> {
    const token = await this.authService.getAccessToken();
    const url = path.indexOf(API_BASE_URL) === 0 ? path : API_BASE_URL + path;
    const res = await fetch(url, {
      ...requestInit,
      headers: {
        ...requestInit?.headers,
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    // console.log(`callEndpoint ${url}`, text);
    return JSON.parse(text);
  }

  private async getPaginatedItems<T>(url: string, requestInit?: RequestInit): Promise<T[]> {
    const result = [];

    do {
      const batch = await this.callEndpoint<SpotifyApi.PagingObject<T>>(url, requestInit);
      result.push(...batch.items);
      url = batch.next;
    } while (url);

    return result;
  }

  async getCurrentUser() {
    return await this.callEndpoint<SpotifyApi.UserObjectPrivate>("me");
  }

  async getPlaylists(): Promise<Playlist[]> {
    const playlists = await this.getPaginatedItems<SpotifyApi.PlaylistObjectSimplified>("me/playlists");
    return playlists.map(p => ({
      ...p,
      tracks: [],
      tracksLoaded: false
    }));
  }

  async getPlaylist(id: string): Promise<Playlist> {
    const playlist = await this.callEndpoint<SpotifyApi.PlaylistObjectFull>(`playlists/${id}`);
    const trackItems = await this.getPaginatedItems<SpotifyApi.PlaylistTrackObject>(playlist.tracks.href);
    return {
      ...playlist,
      tracks: trackItems.map(item => ({
        added_at: item.added_at,
        added_by: item.added_by,
        is_local: item.is_local,
        artist: item.track.artists.map(a => a.name).join(", "),
        ...item.track
      })),
      tracksLoaded: true
    };
  }
}


export class MockSpotifyService {
  getPlaylists(): IPlaylist[] {
    return [
      this.getPlaylist("1001"),
      this.getPlaylist("1002"),
      this.getPlaylist("1003")
    ];
  }

  getPlaylist(id: string): IPlaylist {
    if (id === "1001") {
      return {
        id: "1001",
        name: "Min spilleliste 😍👌",
        tracks: [
          this.getTrack("lolsang1")
        ],
        tracksLoaded: true
      }
    }
    else if (id === "1002") {
      return {
        id: "1002",
        name: "NICE MUISIKK",
        tracks: [
          this.getTrack("lolsang3"),
          this.getTrack("lolsang2")
        ],
        tracksLoaded: true
      }
    }
    else {
      return {
        id: "1003",
        name: "Spillelistenmin",
        tracks: [
          this.getTrack("lolsang1"),
          this.getTrack("lolsang4")
        ],
        tracksLoaded: true
      }
    }
  }

  getTrack(id: string): ITrack {
    if (id === "lolsang1") {
      return {
        id: "lolsang1",
        artist: "The impala",
        name: "Det er jul igjen"
      }
    }
    else if (id === "lolsang2") {
      return {
        id: "lolsang2",
        artist: "Bookiman",
        name: "Hurra meg rundt"
      }
    }
    else if (id === "lolsang3") {
      return {
        id: "lolsang3",
        artist: "Steve",
        name: "Only you"
      }
    }
    else {
      return {
        id: "lolsang4",
        artist: "SHITPOMFRITT",
        name: "Fest i stua"
      }
    }
  }
}
