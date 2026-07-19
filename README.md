# Still & Moving — Meditation for Parkinson's

A responsive, accessible static website built with HTML, CSS, and JavaScript.

## Included

- Home page with separate pathways for people with Parkinson's and healthcare professionals
- Patient welcome/orientation section
- Five expandable meditation modules
- Video, audio, and PDF resource placeholders
- Functional, adjustable breath pacer
- Professional science, research framework, and publications sections
- Light and dark modes with saved preference
- Formspree-ready contact form and newsletter form
- Responsive navigation, FAQ, media modal, simulated audio player, and accessibility support

## Run locally

Open `index.html` directly in a browser, or use a simple local server:

```bash
cd parkinsons-meditation-program
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Formspree setup

In `index.html`, replace:

- `YOUR_FORM_ID` with the Formspree ID for the main contact form
- `YOUR_NEWSLETTER_FORM_ID` with a separate Formspree ID for newsletter subscriptions

Example:

```html
<form action="https://formspree.io/f/xabcdxyz" method="POST">
```

## Add videos

Search `index.html` for the required resource title. Replace its placeholder button with an embed, for example:

```html
<iframe
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
  title="Body scan teaching video"
  allowfullscreen>
</iframe>
```

You can also use Vimeo, Wistia, or self-hosted MP4 video.

## Add audio

The current audio player is a polished interface demonstration. For real meditation audio:

1. Put MP3 files inside `assets/audio/`.
2. Add an HTML `<audio>` element or update the audio section in `script.js` to load each file.
3. Keep audio filenames short and web-safe, such as `body-scan.mp3`.

## Add PDF resources

Put your PDF files in `assets/` and use the filenames already referenced in `index.html`:

- `body-scan-guide.pdf`
- `motor-imagery-guide.pdf`
- `attention-guide.pdf`
- `walking-safety-guide.pdf`

You may rename them, but also update the corresponding `href` value in `index.html`.

## Customize

- Website title and text: `index.html`
- Colors, spacing, typography, dark mode: `styles.css`
- Accordion, modal, breath pacer, theme logic: `script.js`
- Contact emails: search for `hello@example.org` and `research@example.org`
- Science and publications: replace all placeholder research copy with approved content

## Important medical note

The website includes an educational disclaimer. Have all patient-facing and scientific content reviewed by the appropriate clinical, legal, and research teams before publication.
