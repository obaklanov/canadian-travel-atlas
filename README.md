# Canadian Travel Atlas

A travel preparation website for Canadians, with destination starters for Japan, Portugal, Mexico and Thailand.

## Run locally

Open this folder in VS Code, then run:

```powershell
npx.cmd http-server dist -p 8090
```

Open http://localhost:8090 in your browser.

## Files

- `dist/index.html`: page content and layout
- `dist/style.css`: styling and responsive layout
- `dist/app.js`: search, region filters, destination dialogs and checklist
- `dist/images/`: destination photographs
- `image-sources.json`: Unsplash image identifiers
- `download-images.mjs`: script to retrieve the photographs
- `.openai/hosting.json`: Sites hosting configuration

The checklist saves progress in the visitor's browser and can be downloaded as a text file. No backend or build step is required. Country starters link to official Canadian travel information; they are not complete researched guides.

## Hosting

The current private site is hosted at https://canadian-travel-atlas.jocundbud512.chatgpt.site.

This GitHub repository stores the source. Pushing changes here does not automatically update the Sites deployment.
