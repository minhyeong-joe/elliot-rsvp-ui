import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import AuthGate from "./components/AuthGate";
import { api } from "./lib/api";
import "./app.css";

export function meta({ }: Route.MetaArgs) {
  const BASE_URL = import.meta.env.VITE_VERCEL_URL;
  return [
    { title: "은성이 돌잔치" },
    { name: "description", content: "은성이 돌잔치 RSVP" },
    // Open Graph tags for social sharing
    { property: "og:title", content: "은성이 돌잔치 RSVP" },
    { property: "og:description", content: "은성이의 돌잔치에 여러분을 초대합니다" },
    { property: "og:image", content: `${BASE_URL}/img/thumbnail.png` },
    { property: "og:url", content: `${BASE_URL}` },
    { property: "og:type", content: "website" }
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Rouge+Script&family=Single+Day&display=swap"
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const validCode = import.meta.env.VITE_KEY;
  
  // Prewarm backend service to avoid cold start delays
  useEffect(() => {
    const prewarmService = async () => {
      try {
        await api.get('/health');
      } catch (error) {
        // Silently fail - prewarming is non-critical
        console.debug('Service prewarm failed:', error);
      }
    };
    
    prewarmService();
  }, []);
  
  return (
    <AuthGate validCode={validCode}>
      <Outlet />
    </AuthGate>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
