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

export interface ShortLinkItem {
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  expiresAt: string;
  timezone: string;
  title: string;
  numberOfClicks: number;
  createdAt: string;
}

export interface ClickUpdatedEvent {
  numberOfClicks: number;
  shortCode: string;
  occuredAt: string;
}
