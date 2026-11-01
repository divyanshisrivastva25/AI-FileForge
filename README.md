# FileForge — Free Online File Converters

A fully client-side file conversion suite: Word to PDF, Image to PDF, Image
Converter (JPG / PNG / WebP) and Merge PDFs. Everything runs in the browser —
files are never uploaded to a server. Includes a light/dark theme toggle.

## Run locally

You need Node.js 20+ (or Bun). From this folder:

```sh
npm install
npm run dev
```

Then open http://localhost:8080 in your browser.

Production build:

```sh
npm run build
npm run preview
```

## Tests

```sh
npm test
```

## Tools included

| Tool            | Route              | What it does                                  |
| --------------- | ------------------ | --------------------------------------------- |
| Word to PDF     | `/word-to-pdf`     | .docx → PDF, formatting and images preserved  |
| Image to PDF    | `/image-to-pdf`    | Combine images into one PDF with page options |
| Image Converter | `/image-converter` | JPG ↔ PNG ↔ WebP with quality control         |
| Merge PDFs      | `/merge-pdf`       | Combine several PDFs in your chosen order     |

## Built with

- TanStack Start (React 19)
- TypeScript
- Tailwind CSS
- mammoth, jsPDF, pdf-lib, JSZip (loaded in-browser, per conversion)
