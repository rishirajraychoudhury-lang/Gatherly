# Gatherly – Responsive Event Management Website

Browse upcoming events, view details and register. Built for the K Explore Web Designing task with plain HTML5, CSS3 and JavaScript (no frameworks).

**Live site:** _add your Vercel / Netlify / GitHub Pages link_
**Repository:** _add your GitHub link_

## Features
- Hero section with a live countdown to the next event
- Event cards with a custom illustration (local SVG files in `images/`), date, venue and description
- Search by name, venue or keyword, plus category filter chips
- Event detail dialog with a registration form
- JavaScript validation: name (letters only), email format, 10-digit Indian mobile number, duplicate-registration check
- Confirmation message after successful registration
- Bonus: dark/light mode (remembers choice), countdown timer, entrance animations, Local Storage registration data shown under "My tickets"
- Responsive layout for mobile, tablet and desktop; keyboard focus styles and reduced-motion support

## Project structure
```
index.html   page structure and dialog markup
style.css    theme variables, layout, responsive rules
script.js    event data, search/filter, validation, storage, countdown
images/      one SVG illustration per event
```

## How it works
1. Events live in the `EVENTS` array in `script.js`; cards are rendered from it.
2. Search and filter both re-run `render()` on the same array.
3. The detail dialog uses the native `<dialog>` element.
4. Each field has a rule in the `rules` object; errors show on blur and on submit.
5. Registrations are saved to `localStorage` under the key `regs`.
6. Theme is stored under `theme` and applied through a `data-theme` attribute and CSS variables.

## Run locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy
- **GitHub Pages:** Settings → Pages → deploy from `main` branch, root folder.
- **Netlify / Vercel:** import the repo, no build command, publish directory `.`

## Git workflow
```
git init
git add .
git commit -m "Add event management website"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
