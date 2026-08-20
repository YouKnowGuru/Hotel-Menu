# Menu Studio — Canva App

A Canva extension that drops menu elements (headings, section titles, menu items)
onto a Canva design. Built with the Canva Apps SDK (`@canva/*`), mirroring the
official starter structure.

This is a **separate project** from the Next.js `menu-studio` app: Canva apps run
in Canva's own webpack preview runtime on React 18, not Next.js.

## Files

- `src/index.tsx` — entry: mounts `<App>` inside `<AppUiProvider>`, imports the UI kit stylesheet.
- `src/app.tsx` — the app UI + `@canva/design` calls (ported menu-studio "add text" actions).
- `src/styles.css` — local CSS module styles.
- `package.json` — deps + `canva dev` / `canva build` scripts (the CLI provides the build).

## Run it

> The Canva CLI needs your Canva account in a browser — `canva login` is the one
> step that only you can do. Everything else is here.

```bash
cd canva-app
npm install                 # installs deps + the Canva CLI
npx canva login             # opens a browser; paste the confirmation code back
npx canva dev               # starts the preview; open the Canva editor to view
```

If `canva dev` reports a missing app id / `.canva` config, register the app first:

```bash
npx canva apps create "Menu Studio" --template hello_world --distribution private
```

If that refuses a non-empty directory, run it in an empty sibling folder and copy
the generated `.canva/` directory here, then keep this `src/app.tsx`.

## Mapping to menu-studio

| menu-studio (Fabric.js)             | Canva app (@canva/design)              |
| ----------------------------------- | -------------------------------------- |
| `addText()`                          | `addElement({ type: "text", children })` |
| `addMenuItem(name, price)`          | same — a text element per item         |
| `addImage(url)` (Cloudinary)        | `@canva/asset` (add when you need it) |
| object selection / overlays          | `@canva/app-hooks` (`useSelection`, `useOverlay`) |

`@canva/asset` is intentionally **not** a dependency yet — add it when you wire
image upload into the Canva app.
