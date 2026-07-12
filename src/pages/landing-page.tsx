import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link2, Sparkles, Shield, BarChart3, AlertCircle } from 'lucide-react';
import { createShortLinkFormSchema } from '../features/short-links/schemas/create-short-link.schema';
import type { CreateShortLinkFormValues, CreateShortLinkTransformedValues } from '../features/short-links/schemas/create-short-link.schema';
import { calculateExpirationDate, formatLocalDateTime } from '../lib/date-time';
import { useCreateShortLink } from '../features/short-links/hooks/use-create-short-link';
import { useToast } from '../components/common/toast';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutateAsync: createLink, isPending } = useCreateShortLink();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateShortLinkFormValues>({
    resolver: zodResolver(createShortLinkFormSchema),
    defaultValues: {
      longUrl: '',
      expirationPreset: '30-days',
      timezone: 'Asia/Ho_Chi_Minh',
    },
  });

  const onSubmit = async (values: CreateShortLinkFormValues) => {
    setApiError(null);
    try {
      const transformed = values as CreateShortLinkTransformedValues;
      const expiresAt = formatLocalDateTime(calculateExpirationDate(30)); // Default to 30 days

      const requestPayload = {
        longUrl: transformed.longUrl,
        expiresAt,
        timezone: transformed.timezone,
      };

      const response = await createLink(requestPayload);
      toast('Link created successfully!', 'success');

      navigate('/created', {
        state: {
          result: {
            shortCode: response.shortCode,
            shortUrl: response.shortUrl,
            longUrl: transformed.longUrl,
            expiresAt,
            timezone: transformed.timezone,
          },
        },
      });
    } catch (err: any) {
      setApiError(err?.message || 'Failed to create short link.');
      toast('Failed to create short link.', 'error');
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section with dark navy background */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-[800px] space-y-6">
          <div className="inline-flex items-center gap-2 rounded-badge bg-primary-soft/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            Introducing Timezone-Aware Analytics
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Build stronger connections with every link
          </h1>
          
          <p className="mx-auto max-w-[600px] text-base text-slate-400 sm:text-lg">
            Create short links, share them anywhere, and understand how people engage with our clean analytics dashboard.
          </p>

          {/* Embedded shortener card */}
          <div className="mx-auto max-w-xl text-left bg-surface rounded-card border border-border p-6 shadow-2xl mt-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
                <div className="flex items-center gap-3 rounded-card border border-danger/20 bg-danger-soft p-3.5 text-danger text-xs font-semibold animate-slide-in">
                  <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="longUrl" className="block text-xs font-bold text-text-primary uppercase tracking-wider">
                  Destination URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    {...register('longUrl')}
                    type="text"
                    id="longUrl"
                    disabled={isPending}
                    placeholder="https://example.com/products/123"
                    className={`block flex-1 rounded-input border ${
                      errors.longUrl ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'
                    } bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none transition-colors`}
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-button bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors disabled:bg-primary/50"
                  >
                    {isPending ? 'Shortening...' : 'Shorten'}
                  </button>
                </div>
                {errors.longUrl && (
                  <p className="text-xs font-semibold text-danger">{errors.longUrl.message}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section id="features" className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-[600px] mx-auto space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Everything you need to control your sharing
          </h2>
          <p className="text-sm text-text-secondary">
            Get immediate insights and customize redirects in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-card border border-border bg-surface p-6 shadow-subtle space-y-3">
            <div className="rounded-full bg-primary-soft p-3 text-primary w-fit">
              <Link2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">Instant Shortening</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Paste your long destination URLs and generate readable short link codes instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-card border border-border bg-surface p-6 shadow-subtle space-y-3">
            <div className="rounded-full bg-success-soft p-3 text-success w-fit">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">Clean Metrics</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Track redirects, daily click counts, averages, and peak days with interactive charts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-card border border-border bg-surface p-6 shadow-subtle space-y-3">
            <div className="rounded-full bg-warning-soft p-3 text-warning w-fit">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">Link Security</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Secure links with customizable expiration date/time configurations and target timezones.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
