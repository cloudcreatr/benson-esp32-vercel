import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { connect } from "@planetscale/database";
if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    const config = {
      host: context.env.DATABASE_HOST,
      username: context.env.DATABASE_USERNAME,
      password: context.env.DATABASE_PASSWORD,
      fetch: (url, init) => {
        delete init["cache"];
        return fetch(url, init);
      },
    };

    return {
      env: context.env,
      connection: connect(config),
    };
  },
  mode: build.mode,
});
