import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically clean up react components after each test runs
afterEach(() => {
  cleanup();
});
