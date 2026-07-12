import React from 'react';
import { Link2, Calendar, Globe, Eye } from 'lucide-react';
import type { CreateShortLinkFormValues } from '../schemas/create-short-link.schema';
import { calculateExpirationDate, formatReadableDate } from '../../../lib/date-time';

interface ShortLinkPreviewProps {
  values: Partial<CreateShortLinkFormValues>;
}

export const ShortLinkPreview: React.FC<ShortLinkPreviewProps> = ({ values }) => {
  const { longUrl, expirationPreset, customExpirationDate, customExpirationTime, timezone } = values;

  let expirationDisplay = '';
  if (expirationPreset === '7-days') {
    const date = calculateExpirationDate(7);
    expirationDisplay = `In 7 days (${formatReadableDate(date.toISOString())})`;
  } else if (expirationPreset === '30-days') {
    const date = calculateExpirationDate(30);
    expirationDisplay = `In 30 days (${formatReadableDate(date.toISOString())})`;
  } else if (expirationPreset === 'custom' && customExpirationDate && customExpirationTime) {
    const combinedStr = `${customExpirationDate}T${customExpirationTime}`;
    expirationDisplay = formatReadableDate(combinedStr, timezone);
  } else {
    expirationDisplay = 'Not set';
  }

  const destinationDisplay = longUrl && longUrl.trim() !== ''
    ? longUrl
    : 'https://example.com/products/123';

  return (
    <div className="flex h-full flex-col justify-between rounded-card border border-border bg-surface p-6 shadow-subtle">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Eye className="h-5 w-5 text-text-secondary" />
        <h3 className="text-sm font-semibold text-text-primary">
          Live Link Preview
        </h3>
      </div>

      <div className="my-6 rounded-card border border-border bg-surface-muted p-5 space-y-4">
        <div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Short Link URL
          </span>
          <div className="mt-1 flex items-center gap-2 text-primary font-semibold text-base">
            <Link2 className="h-4 w-4" />
            <span className="truncate">
              linkflow.co/xxxxxx
            </span>
          </div>
          <p className="mt-1 text-xs text-text-secondary italic">
            * The short link code will be generated after creation.
          </p>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div>
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Destination URL
            </span>
            <span className="text-sm text-text-primary block truncate mt-0.5">
              {destinationDisplay}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                Expiration
              </span>
              <span className="text-xs text-text-primary block mt-0.5 font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-text-muted" />
                <span className="truncate">{expirationPreset === 'custom' ? 'Custom' : expirationPreset === '7-days' ? '7 Days' : '30 Days'}</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                Timezone
              </span>
              <span className="text-xs text-text-primary block mt-0.5 font-medium flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-text-muted" />
                <span className="truncate">{timezone || 'Asia/Ho_Chi_Minh'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded p-2.5 border border-border text-[11px] text-text-secondary leading-relaxed">
          <strong>Will expire on:</strong>
          <div className="text-text-primary mt-0.5 font-medium">
            {expirationDisplay}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary">Link Status</span>
          <span className="inline-flex items-center rounded-badge bg-success-soft px-2.5 py-0.5 text-xs font-medium text-success border border-success/10">
            Active
          </span>
        </div>
      </div>

      <p className="text-xs text-text-muted text-center leading-relaxed">
        This preview shows a live configuration mockup. Re-verify values before completing submission.
      </p>
    </div>
  );
};
