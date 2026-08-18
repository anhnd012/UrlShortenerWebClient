import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
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
      domain: 'bit.ly',
      backHalf: '',
      title: '',
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

  const handleGenerateBackHalf = () => {
    const generated = Math.random().toString(36).substring(2, 8);
    setValue('backHalf', generated);
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as CreateShortLinkTransformedValues))}
      className="space-y-6 rounded-card border border-border bg-surface p-6 shadow-subtle relative"
    >
      <div className="space-y-4">
        {/* Destination URL */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="longUrl"
              className="block text-xs font-bold text-text-primary uppercase tracking-wider"
            >
              Destination URL
            </label>
            <span className="text-[10px] text-text-muted">Hit Enter ↵ to create</span>
          </div>
          <div className="relative rounded-input">
            <input
              {...register('longUrl')}
              type="text"
              id="longUrl"
              disabled={isLoading}
              placeholder="https://linear.app/url-shortener-duc-anh/document/project-link-task-design-and-review-contract"
              className={`block w-full rounded-input border ${
                errors.longUrl ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'
              } bg-surface px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none transition-colors`}
              aria-invalid={errors.longUrl ? 'true' : 'false'}
            />
          </div>
          {errors.longUrl && (
            <p className="text-xs font-medium text-danger">{errors.longUrl.message}</p>
          )}
        </div>

        {/* Short Link Domain & Back-half */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Domain */}
          <div className="space-y-1.5">
            <label
              htmlFor="domain"
              className="block text-xs font-bold text-text-primary uppercase tracking-wider"
            >
              Short link domain
            </label>
            <div className="relative">
              <select
                {...register('domain')}
                id="domain"
                disabled={isLoading}
                className="block w-full rounded-input border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="bit.ly">bit.ly</option>
                <option value="linkflow.co">linkflow.co</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Back-half */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="backHalf"
                className="block text-xs font-bold text-text-primary uppercase tracking-wider"
              >
                Back-half (optional)
              </label>
              <button
                type="button"
                onClick={handleGenerateBackHalf}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-hover border border-primary/20 rounded bg-primary-soft/30 px-1.5 py-0.5"
              >
                <Sparkles className="h-3 w-3" />
                Generate
              </button>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-text-muted px-2.5 font-semibold bg-surface-muted border border-r-0 border-border h-[38px] flex items-center rounded-l-input">
                /
              </span>
              <input
                {...register('backHalf')}
                type="text"
                id="backHalf"
                disabled={isLoading}
                placeholder="e.g. marketing-campaign"
                className={`block w-full rounded-r-input border ${
                  errors.backHalf ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'
                } bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none h-[38px] transition-colors`}
              />
            </div>
            {errors.backHalf && (
              <p className="text-xs font-medium text-danger">{errors.backHalf.message}</p>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="block text-xs font-bold text-text-primary uppercase tracking-wider"
          >
            Title (optional)
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            disabled={isLoading}
            placeholder="e.g. Linear"
            className="block w-full rounded-input border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Mock Tags */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
            Tags (optional)
          </label>
          <div className="relative">
            <select
              disabled
              className="block w-full rounded-input border border-border bg-surface px-3 py-2.5 text-sm text-text-muted focus:outline-none appearance-none cursor-not-allowed opacity-60"
            >
              <option>Select tags</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Expiration Preset */}
        <div className="space-y-3 pt-2">
          <span className="block text-xs font-bold text-text-primary uppercase tracking-wider">
            Expiration Settings
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['7-days', '30-days', 'custom'] as const).map((option) => (
              <button
                key={option}
                type="button"
                disabled={isLoading}
                onClick={() => handlePresetChange(option)}
                className={`rounded-button border px-3 py-2 text-xs font-medium transition-colors ${
                  preset === option
                    ? 'border-primary bg-primary-soft text-primary font-semibold'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-muted'
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
      </div>

      {/* Form Action Footer */}
      <div className="border-t border-border pt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => navigate(-1)}
          className="rounded-button border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary bg-surface hover:bg-surface-muted transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating link...' : 'Create your link'}
        </button>
      </div>
    </form>
  );
};
export default CreateShortLinkForm;
