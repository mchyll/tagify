import AuthService, { IAuthService } from "./AuthService";
import SpotifyService from "./SpotifyService";


export const auth: IAuthService = new AuthService({
  clientId: "1cdd8676ca68489b824f984061d67d1a",
  scope: "playlist-read-private playlist-read-collaborative",
  redirectUri: "http://localhost:3000",
  authorizationUri: "https://accounts.spotify.com/authorize",
  tokenEndpointUri: "https://accounts.spotify.com/api/token"
});

export const spotify = new SpotifyService(auth);

export const Services = {
  auth,
  spotify
}
