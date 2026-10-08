# little notes

A responsive, Google Keep-inspired notes app built with React, Vite, and Tailwind CSS. Notes are saved in browser local storage, so they remain available after a refresh.

## Features

- Create, edit, archive, pin, and delete notes, with confirmation before deleting.
- Choose from eight note colors and organize notes with tags.
- Search note titles, content, and tags; sort by last edit, title, or color.
- Switch between grid and list layouts, and select multiple notes to archive or delete.
- Format note content with bold, italics, and bulleted lists.
- Validate required content, title and content limits, tag limits, and duplicate notes.
- Use `/` to focus search, `N` to create a note, `Esc` to close a dialog, and `Ctrl`/`Cmd` + `Enter` to save.
- Browse notes, tags, and the archive on desktop and mobile.

## Development

```sh
npm install
npm run dev
```

Run the production build and lint checks with:

```sh
npm run build
npm run lint
```
