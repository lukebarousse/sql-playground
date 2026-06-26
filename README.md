# SQL Playground — Luke Barousse course edition

An in-browser SQL playground for the SQL for Data Analytics course. Students
open a link, a SQLite database loads in their browser, and they run queries
with charts — no install, no server, nothing leaves their machine.

This is a fork of the excellent open-source **[sqliteviz](https://github.com/lana-k/sqliteviz)**
project, customized for the course. See [`NOTICE`](NOTICE) and [`LICENSE`](LICENSE)
for attribution (Apache-2.0).

## What this fork adds

- **Remembers the last dataset across refreshes.** Upstream resets to the bundled
  demo database when the page reloads. Here, the last dataset a student loaded is
  saved and automatically restored on refresh.
- **Dataset switcher.** A dropdown in the top bar lets students switch datasets at
  runtime (no rebuild, no redeploy). Datasets are defined in
  [`public/datasets.json`](public/datasets.json).
- **Light / dark mode.** A toggle in the top bar, persisted and defaulting to the
  visitor's OS preference. The SQL editor (CodeMirror) is themed too.
- **Course branding** in the navbar, title, and welcome screen.

## Managing datasets (no rebuild needed)

`public/datasets.json` is served as a static file, so you can edit it on the host
and changes take effect on the next page load:

```json
{
  "default": "jobs",
  "datasets": [
    {
      "id": "jobs",
      "label": "SQL Jobs Database (2023)",
      "data_url": "https://storage.googleapis.com/jobs_db/jobs_2023.db",
      "data_format": "sqlite",
      "inquiry_url": "https://storage.googleapis.com/jobs_db/jobs_2023_inquiries.json"
    }
  ]
}
```

- `default` — the dataset loaded for a first-time visitor with no saved choice.
  Set it to `null` to instead show the upload/welcome screen on the bare domain.
- Each dataset mirrors the upstream `/load` parameters (`data_url`,
  `data_format`, `inquiry_url`).

Direct deep links still work, e.g.:

```
/#/load?data_url=https://storage.googleapis.com/jobs_db/jobs_2023.db&data_format=sqlite&inquiry_url=https://storage.googleapis.com/jobs_db/jobs_2023_inquiries.json
```

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run serve    # preview the production build
```

## Deploy

See [`DEPLOY.md`](DEPLOY.md) for hosting on Cloudflare Pages at
`sql.lukebarousse.com`.

## Staying up to date with sqliteviz

The upstream project is configured as the `upstream` git remote:

```sh
git fetch upstream
git merge upstream/master   # resolve conflicts, then rebuild
```

---

Built on [sqliteviz](https://github.com/lana-k/sqliteviz) — itself built on
[react-chart-editor](https://github.com/plotly/react-chart-editor),
[PivotTable.js](https://github.com/nicolaskruchten/pivottable),
[sql.js](https://github.com/sql-js/sql.js) and
[CodeMirror](https://codemirror.net/) in [Vue.js](https://github.com/vuejs/vue).
