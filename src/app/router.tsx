import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/public-layout';
import { AuthLayout } from '../layouts/auth-layout';
import { DashboardLayout } from '../layouts/dashboard-layout';
import { LandingPage } from '../pages/landing-page';
import { LoginPage } from '../pages/login-page';
import { CreateLinkPage } from '../pages/create-link-page';
import { CreatedLinkPage } from '../pages/created-link-page';
import { AnalyticsPage } from '../pages/analytics-page';
import { LinkExpiredPage } from '../pages/link-expired-page';
import { LinkNotActivePage } from '../pages/link-not-active-page';
import { NotFoundPage } from '../pages/not-found-page';

export const router = createBrowserRouter([
  // Public marketing routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: '',
        element: <LandingPage />,
      },
    ],
  },
  // Auth login/signup routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <LoginPage />,
      },
    ],
  },
  // Authenticated application dashboard routes
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'create',
        element: <CreateLinkPage />,
      },
      {
        path: 'created',
        element: <CreatedLinkPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'analytics/:shortCode',
        element: <AnalyticsPage />,
      },
      {
        path: 'link-expired',
        element: <LinkExpiredPage />,
      },
      {
        path: 'link-not-active',
        element: <LinkNotActivePage />,
      },
      {
        path: 'not-found',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
