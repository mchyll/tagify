import base64url from "base64url";
import { Observable } from "../utils/Observable";
import { StoredObject } from "../utils/StoredObject";


export function createRandomString() {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
  let random = "";
  Array.from(window.crypto.getRandomValues(new Uint8Array(43)))
    .forEach(v => (random += charset[v % charset.length]));
  return random;
};

export async function sha256(message: string) {
  const messageBuffer = new TextEncoder().encode(message);
  const hash = await window.crypto.subtle.digest("SHA-256", messageBuffer);
  return Buffer.from(hash);
}

export function hasAuthParams(searchParams = window.location.search) {
  return (/[?&]code=[^&]+/.test(searchParams) && /[?&]state=[^&]+/.test(searchParams)) ||
    /[?&]error=[^&]+/.test(searchParams);
}

const toUrlEncoded = (obj: any) => Object.keys(obj).map(k => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k])).join("&");


interface AccessToken {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
  validUntil: number;
}

interface AuthTransaction {
  codeVerifier: string;
  oauthState: string;
}

interface AuthServiceSettings {
  clientId: string;
  scope: string;
  redirectUri: string;
  authorizationUri: string;
  tokenEndpointUri: string;
}


export interface IAuthService {
  isAuthorized(): boolean;
  getAccessToken(): Promise<string>;
  authorizeRedirect(): Promise<void>;
  onAuthorized: Observable;
}

export default class AuthService implements IAuthService {
  private accessTokenStore: StoredObject<AccessToken>;
  private authTransactionStore: StoredObject<AuthTransaction>;

  onAuthorized: Observable;

  constructor(public settings: AuthServiceSettings) {
    this.accessTokenStore = new StoredObject(window.localStorage, "AuthService.AccessToken");
    this.authTransactionStore = new StoredObject(window.sessionStorage, "AuthService.AuthTransaction");
    this.onAuthorized = new Observable(true);

    if (hasAuthParams() && this.authTransactionStore.hasValue()) {
      this.handleRedirect();
    }
    else if (this.isAuthorized()) {
      this.onAuthorized.notify();
    }
  }

  isAuthorized() {
    // TODO: This does not check if the token is still valid
    return this.accessTokenStore.hasValue();
  }

  async getAccessToken() {
    if (!this.accessTokenStore.hasValue()) {
      throw new Error("No access token present");
    }

    const accessToken = this.accessTokenStore.get();
    if (accessToken.validUntil > Date.now() / 1000) {
      return accessToken.access_token;
    }
    else {
      // Refresh the token

      await this.fetchAndSetToken({
        client_id: this.settings.clientId,
        grant_type: "refresh_token",
        refresh_token: accessToken.refresh_token
      });

      // TODO: Check if refresh is rejected

      return this.accessTokenStore.get().access_token;
    }
  }

  async authorizeRedirect() {
    const codeVerifier = createRandomString();
    const oauthState = createRandomString();
    const codeChallenge = base64url(await sha256(codeVerifier));

    this.authTransactionStore.save({ codeVerifier, oauthState });

    const authUrl = new URL(this.settings.authorizationUri);
    authUrl.searchParams.append("client_id", this.settings.clientId);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("redirect_uri", this.settings.redirectUri);
    authUrl.searchParams.append("code_challenge_method", "S256");
    authUrl.searchParams.append("code_challenge", codeChallenge);
    authUrl.searchParams.append("scope", this.settings.scope);
    authUrl.searchParams.append("state", oauthState);

    window.location.href = authUrl.toString();
  }

  private async handleRedirect(redirectedUrl = window.location.href) {
    const url = new URL(redirectedUrl);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const state = url.searchParams.get("state");

    window.history.replaceState(null, "", window.location.pathname);

    const authTransaction = this.authTransactionStore.get();

    if (error) {
      throw new Error("Authorization error: " + error);
    }
    if (!authTransaction.codeVerifier) {
      throw new Error("Missing codeVerifier locally");
    }
    if (state !== authTransaction.oauthState) {
      throw new Error("State mismatch");
    }
    if (!code) {
      throw new Error("Missing authorization code");
    }
    // TODO maybe cleanup the auth flow state after errors

    this.authTransactionStore.remove();

    await this.fetchAndSetToken({
      client_id: this.settings.clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: this.settings.redirectUri,
      code_verifier: authTransaction.codeVerifier
    });

    this.onAuthorized.notify();
  }

  private async fetchAndSetToken(requestBody: any) {
    const res = await fetch(this.settings.tokenEndpointUri, {
      method: "POST",
      body: toUrlEncoded(requestBody),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    const json = await res.json();
    this.accessTokenStore.save({
      ...json,
      validUntil: Date.now() / 1000 + json.expires_in
    });
  }
}
