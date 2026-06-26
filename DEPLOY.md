# Deploying to `sql.lukebarousse.com`

This app is a fully static site (HTML/JS/WASM). Any static host works. These
instructions use **Cloudflare Pages** (free, fast, durable), which is the
recommended option.

## Build settings

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 or 22 |

> Local note: if a local build ever fails with
> `Cannot find module '@rollup/rollup-darwin-arm64'`, run
> `npm install @rollup/rollup-darwin-arm64` once. This is an npm optional-dependency
> bug, not a problem with the app. CI/Cloudflare installs the correct binary
> automatically.

## Option A — Cloudflare Pages from a GitHub repo (recommended)

1. Push this folder to a GitHub repo (e.g. `lukebarousse/sql-playground`):
   ```sh
   git remote add origin git@github.com:lukebarousse/sql-playground.git
   git add -A && git commit -m "SQL Playground (sqliteviz fork)"
   git push -u origin master
   ```
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo. Set build command `npm run build` and output directory `dist`.
   Add an environment variable `NODE_VERSION = 22` if the default is older.
4. Deploy. You'll get a `*.pages.dev` URL to verify.

Every `git push` now redeploys automatically.

## Option B — Cloudflare Pages direct upload (no GitHub)

```sh
npm run build
npx wrangler pages deploy dist --project-name sql-playground
```

## Custom domain — `sql.lukebarousse.com`

1. In the Pages project: **Custom domains → Set up a custom domain →**
   `sql.lukebarousse.com`.
2. **If `lukebarousse.com` DNS is on Cloudflare:** the `CNAME` record is added
   for you. Done.
3. **If DNS is elsewhere** (e.g. your registrar or Kajabi's DNS): add a `CNAME`
   record at your DNS provider:
   ```
   sql   CNAME   <your-project>.pages.dev
   ```
   Cloudflare will issue the HTTPS certificate automatically (a few minutes).

> Kajabi note: Kajabi can host the main `lukebarousse.com` site, but a
> **subdomain** like `sql.` is just a DNS record you point wherever you want —
> it does not need to live in Kajabi. So this coexists with your Kajabi site.

## Embedding inside a Kajabi lesson (optional)

To show the playground *inside* a course lesson, add a Custom Code / HTML block
in Kajabi with an iframe:

```html
<iframe
  src="https://sql.lukebarousse.com/#/load?data_url=https://storage.googleapis.com/jobs_db/jobs_2023.db&data_format=sqlite&inquiry_url=https://storage.googleapis.com/jobs_db/jobs_2023_inquiries.json"
  style="width:100%; height:80vh; border:0; border-radius:8px;"
  title="SQL Playground"
></iframe>
```

Students can also just open `sql.lukebarousse.com` (or your `lukeb.co` short
links) in a full tab — recommended for the best experience.

## Repointing your existing short links

Your Bitly / `lukeb.co` links currently point at `sqliteviz.com/app/#/load?...`.
After deploy, edit them to point at the same path on your domain:

```
https://sql.lukebarousse.com/#/load?data_url=https://storage.googleapis.com/jobs_db/jobs_2023.db&data_format=sqlite&inquiry_url=https://storage.googleapis.com/jobs_db/jobs_2023_inquiries.json
```

The query string is identical to what you use today — only the host changes.

## Updating datasets later

Edit `public/datasets.json` and redeploy (or edit the deployed file directly).
No code changes needed. See `README.md` for the format.
```
