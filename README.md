# Quick Note App

Full-stack note-taking app: Node.js/Express REST API + HTML/JS frontend (fetch()).

## API
- `GET /notes` - list notes
- `POST /notes` - create note (`{ "title", "content" }`)
- `DELETE /notes/:id` - delete note

## Run locally
```
npm install
npm start
```
Open http://localhost:3000

## Deploy
Deploy on Render (Web Service): Build Command `npm install`, Start Command `npm start`.

Note: notes are stored in `notes.json`; on free hosts this file may reset on redeploy.
