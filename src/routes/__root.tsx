import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Infotelcom — Formations Télécoms & Informatique" },
      {
        name: "description",
        content:
          "Infotelcom : centre de formation expert en télécoms (fibre, radio, transmission) et informatique (cybersécurité, dev, data) au Congo.",
      },
      { name: "author", content: "Infotelcom" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Infotelcom — Formations Télécoms & Informatique" },
      { name: "twitter:title", content: "Infotelcom — Formations Télécoms & Informatique" },
      { name: "description", content: "Formations Télécoms & Informatique" },
      { property: "og:description", content: "Formations Télécoms & Informatique" },
      { name: "twitter:description", content: "Formations Télécoms & Informatique" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2b2e4d7-6382-4728-9470-329d5c57654c/id-preview-8859fc08--36bb1be9-4ecf-4279-aac4-9a9e89423465.lovable.app-1777024298051.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2b2e4d7-6382-4728-9470-329d5c57654c/id-preview-8859fc08--36bb1be9-4ecf-4279-aac4-9a9e89423465.lovable.app-1777024298051.png" },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
