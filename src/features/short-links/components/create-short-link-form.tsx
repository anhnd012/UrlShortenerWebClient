import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, Globe } from 'lucide-react';
import {
  createShortLinkFormSchema,
} from '../schemas/create-short-link.schema';
import type {
  CreateShortLinkFormValues,
  CreateShortLinkTransformedValues,
} from '../schemas/create-short-link.schema';
import { getDefaultTimezone } from '../../../lib/date-time';

const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh — GMT+7' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore — GMT+8' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo — GMT+9' },
  { value: 'Europe/London', label: 'Europe/London — GMT+0' },
  { value: 'Europe/Paris', label: 'Europe/Paris — GMT+1' },
  { value: 'America/New_York', label: 'America/New_York — GMT-5' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles — GMT-8' },
];

interface CreateShortLinkFormProps {
  onSubmit: (values: CreateShortLinkTransformedValues) => void;
  isLoading: boolean;
  onValuesChange: (values: Partial<CreateShortLinkFormValues>) => void;
}

export const CreateShortLinkForm: React.FC<CreateShortLinkFormProps> = ({
  onSubmit,
  isLoading,
  onValuesChange,
}) => {
  const browserTz = getDefaultTimezone();
  
  const timezoneOptions = TIMEZONES.some((tz) => tz.value === browserTz)
    ? TIMEZONES
    : [{ value: browserTz, label: `${browserTz} — Local Timezone` }, ...TIMEZONES];

  const defaultDateStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<CreateShortLinkFormValues>({
    resolver: zodResolver(createShortLinkFormSchema),
    defaultValues: {
      longUrl: '',
      expirationPreset: '30-days',
      customExpirationDate: defaultDateStr,
      customExpirationTime: '23:59',
      timezone: browserTz,
    },
  });

  const formValues = useWatch({ control });

  useEffect(() => {
    onValuesChange(formValues);
  }, [formValues, onValuesChange]);

  const preset = formValues.expirationPreset;

  const handlePresetChange = (val: '7-days' | '30-days' | 'custom') => {
    setValue('expirationPreset', val);
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as CreateShortLinkTransformedValues))}
      className="space-y-6 rounded-card border border-border bg-surface p-6 shadow-subtle"
    >
      {/* Destination URL */}
      <div className="space-y-2">
        <label
          htmlFor="longUrl"
          className="block text-sm font-semibold text-text-primary"
        >
          Destination URL
        </label>
        <div className="relative rounded-input shadow-sm">
          <input
            {...register('longUrl')}
            type="text"
            id="longUrl"
            disabled={isLoading}
            placeholder="https://example.com/products/123"
            className={`block w-full rounded-input border ${
              errors.longUrl ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'
            } bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none transition-colors`}
            aria-invalid={errors.longUrl ? 'true' : 'false'}
            aria-describedby={errors.longUrl ? 'longUrl-error' : undefined}
          />
        </div>
        {errors.longUrl && (
          <p
            id="longUrl-error"
            className="text-xs font-medium text-danger"
          >
            {errors.longUrl.message}
          </p>
        )}
      </div>

      {/* Expiration Preset */}
      <div className="space-y-3">
        <span className="block text-sm font-semibold text-text-primary">
          Expiration
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['7-days', '30-days', 'custom'] as const).map((option) => (
            <button
              key={option}
              type="button"
              disabled={isLoading}
              onClick={() => handlePresetChange(option)}
              className={`rounded-button border px-3 py-2.5 text-xs font-medium transition-colors ${
                preset === option
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary'
              }`}
            >
              {option === '7-days' && '7 Days'}
              {option === '30-days' && '30 Days'}
              {option === 'custom' && 'Custom'}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Expiration Fields */}
      {preset === 'custom' && (
        <div className="space-y-4 rounded-card border border-border bg-surface-muted p-4 animate-slide-in">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Expiration Date */}
            <div className="space-y-1.5">
              <label
                htmlFor="customExpirationDate"
                className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary"
              >
                <Calendar className="h-3.5 w-3.5" />
                Date
              </label>
              <input
                {...register('customExpirationDate')}
                type="date"
                id="customExpirationDate"
                disabled={isLoading}
                className={`block w-full rounded-input border ${
                  errors.customExpirationDate ? 'border-danger' : 'border-border'
                } bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary`}
              />
            </div>

            {/* Expiration Time */}
            <div className="space-y-1.5">
              <label
                htmlFor="customExpirationTime"
                className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary"
              >
                <Clock className="h-3.5 w-3.5" />
                Time
              </label>
              <input
                {...register('customExpirationTime')}
                type="time"
                id="customExpirationTime"
                disabled={isLoading}
                className="block w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-1.5">
            <label
              htmlFor="timezone"
              className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary"
            >
              <Globe className="h-3.5 w-3.5" />
              Timezone
            </label>
            <select
              {...register('timezone')}
              id="timezone"
              disabled={isLoading}
              className="block w-full rounded-input border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
            >
              {timezoneOptions.map((tz) => (
                <option
                  key={tz.value}
                  value={tz.value}
                >
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {errors.customExpirationDate && (
            <p className="text-xs font-medium text-danger">
              {errors.customExpirationDate.message}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-button bg-primary py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Creating link...' : 'Create short link'}
      </button>
    </form>
  );
};
