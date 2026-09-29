import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "@/components/layout/auth-layout";
import { PublicLayout } from "@/components/layout/public-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { GuestOnly, RequireAdmin, RequireAuth } from "@/components/shared/route-guards";
import { LandingPage } from "@/pages/landing-page";
import { PolicyPage } from "@/pages/policy-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { LoginPage } from "@/pages/auth/login-page";
import { SignupPage } from "@/pages/auth/signup-page";
import { VerifyEmailPage } from "@/pages/auth/verify-email-page";
import { SupportPage } from "@/pages/support/support-page";
import { OverviewPage } from "@/pages/admin/overview-page";
import { RequestsPage } from "@/pages/admin/requests-page";
import { RequestDetailPage } from "@/pages/admin/request-detail-page";
import { CustomersPage } from "@/pages/admin/customers-page";

export const router = createBrowserRouter([
  {
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: "policy", element: <PolicyPage /> },
          {
            element: <RequireAuth />,
            children: [{ path: "support", element: <SupportPage /> }],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            element: <GuestOnly />,
            children: [
              { path: "login", element: <LoginPage /> },
              { path: "signup", element: <SignupPage /> },
            ],
          },
          { path: "verify-email", element: <VerifyEmailPage /> },
        ],
      },
      {
        path: "admin",
        element: <RequireAdmin />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <OverviewPage /> },
              { path: "requests", element: <RequestsPage /> },
              { path: "requests/:id", element: <RequestDetailPage /> },
              { path: "customers", element: <CustomersPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
