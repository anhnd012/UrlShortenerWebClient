export interface CreateShortLinkRequest {
  longUrl: string;
  expiresAt: string;
  timezone: string;
}

export interface CreateShortLinkResponse {
  shortCode: string;
  shortUrl: string;
}

export interface ShortLink {
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  expiresAt: string;
  timezone: string;
}
