import { http, HttpResponse } from 'msw';

// In-memory link store for mock mode
const mockLinks = new Map<string, { longUrl: string; expiresAt: string; timezone: string }>();

// Seed with default data
mockLinks.set('abc123', {
  longUrl: 'https://example.com/products/123',
  expiresAt: '2026-08-20T23:59:00',
  timezone: 'Asia/Ho_Chi_Minh',
});

export const handlers = [
  // Create Short Link
  http.post('*/api/v1/urls', async ({ request }) => {
    const body = (await request.json()) as {
      longUrl: string;
      expiresAt: string;
      timezone: string;
    };

    if (!body.longUrl) {
      return HttpResponse.json(
        { message: 'Destination URL is required.' },
        { status: 400 }
      );
    }

    // Generate a random 6 char short code
    const shortCode = Math.random().toString(36).substring(2, 8);
    mockLinks.set(shortCode, body);

    return HttpResponse.json(
      {
        shortCode,
        shortUrl: `http://localhost:8080/${shortCode}`,
      },
      { status: 201 }
    );
  }),

  // Analytics
  http.get('*/api/v1/analytics/:shortCode', ({ params }) => {
    const { shortCode } = params;

    // If link doesn't exist in our memory, return 404
    if (shortCode !== 'abc123' && !mockLinks.has(shortCode as string)) {
      return HttpResponse.json(
        { message: 'No analytics were found for this short code.' },
        { status: 404 }
      );
    }

    // Generate fake daily clicks for the last 7 days
    const dailyClicks = [];
    let totalClicks = 0;
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Random click count, seed-like behaviour for abc123
      const clicks = shortCode === 'abc123' 
        ? [12, 18, 5, 22, 15, 28, 20][6 - i]
        : Math.floor(Math.random() * 30);
      
      dailyClicks.push({ date: dateString, clicks });
      totalClicks += clicks;
    }

    return HttpResponse.json({
      shortCode,
      totalClicks,
      dailyClicks,
    });
  }),
];
