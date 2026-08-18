import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/page-header';
import { CreateShortLinkForm } from '../features/short-links/components/create-short-link-form';
import { ShortLinkPreview } from '../features/short-links/components/short-link-preview';
import { useCreateShortLink } from '../features/short-links/hooks/use-create-short-link';
import type {
  CreateShortLinkFormValues,
  CreateShortLinkTransformedValues,
} from '../features/short-links/schemas/create-short-link.schema';
import { calculateExpirationDate, formatLocalDateTime } from '../lib/date-time';
import { useToast } from '../components/common/toast';
import { AlertCircle } from 'lucide-react';

export const CreateLinkPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<Partial<CreateShortLinkFormValues>>({});
  const { mutateAsync: createLink, isPending, error, reset } = useCreateShortLink();

  const handleSubmit = async (values: CreateShortLinkTransformedValues) => {
    reset();
    try {
      let expiresAt = '';
      if (values.expirationPreset === '7-days') {
        expiresAt = formatLocalDateTime(calculateExpirationDate(7));
      } else if (values.expirationPreset === '30-days') {
        expiresAt = formatLocalDateTime(calculateExpirationDate(30));
      } else if (values.expirationPreset === 'custom' && values.customExpirationDate && values.customExpirationTime) {
        expiresAt = `${values.customExpirationDate}T${values.customExpirationTime}:00`;
      }

      const requestPayload = {
        longUrl: values.longUrl,
        expiresAt,
        timezone: values.timezone,
        title: values.title,
        backHalf: values.backHalf,
      };

      const response = await createLink(requestPayload);
      
      toast('Link created successfully!', 'success');
      
      navigate('/created', {
        state: {
          result: {
            shortCode: response.shortCode,
            shortUrl: response.shortUrl,
            longUrl: values.longUrl,
            expiresAt,
            timezone: values.timezone,
            title: values.title || response.shortCode,
          },
        },
      });
    } catch {
      toast('Failed to create short link.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create a short link"
        description="Turn a long destination URL into a shareable short link."
      />

      {error && (
        <div className="flex items-center gap-3 rounded-card border border-danger/20 bg-danger-soft p-4 text-danger animate-slide-in">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{error.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-7">
          <CreateShortLinkForm
            onSubmit={handleSubmit}
            isLoading={isPending}
            onValuesChange={setFormValues}
          />
        </div>

        <div className="lg:col-span-5">
          <ShortLinkPreview values={formValues} />
        </div>
      </div>
    </div>
  );
};
