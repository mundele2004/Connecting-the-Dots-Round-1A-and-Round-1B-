# Connecting-the-Dots-Round-1A-and-Round-1B-

# Adobe PDF Intelligence Challenge

This repository contains solutions for the Adobe Hackathon rounds focusing on PDF document intelligence. It includes implementations for:

* **Round 1A: PDF Outline Extractor** — Extracts structured outlines (title and hierarchical headings) from PDF files (≤ 50 pages), fully offline, using PDF.js.
* **Round 1B: Persona-Driven Document Intelligence** — Analyzes a collection of PDF documents based on a specified persona and job-to-be-done, ranking and extracting the most relevant sections client-side.

---

## Table of Contents

* [Overview](#overview)
* [Round 1A: PDF Outline Extractor](#round-1a-pdf-outline-extractor)

  * [Description](#description)
  * [Tech Stack](#tech-stack)
  * [Installation & Usage](#installation--usage)
  * [Project Structure](#project-structure)
* [Round 1B: Persona-Driven Document Intelligence](#round-1b-persona-driven-document-intelligence)

  * [Description](#description-1)
  * [Tech Stack](#tech-stack-1)
  * [Installation & Usage](#installation--usage-1)
  * [Project Structure](#project-structure-1)
* [Contributing](#contributing)
* [License](#license)

---

## Overview

Adobe’s "Connecting the Dots Challenge" aims to reimagine PDF interaction by enabling automated structure extraction and persona-driven insights. This repo implements client-side solutions for both document outlining and intelligent section extraction, paving the way for richer, more context-aware PDF experiences.

---

## Round 1A: PDF Outline Extractor

### Description

Builds the "brains" of the challenge by extracting a clean, hierarchical outline (Title, H1, H2, H3) from any PDF up to 50 pages. Results are rendered and available for download as JSON.

### Tech Stack

* **HTML5** & **CSS3** for layout and styling
* **Vanilla JavaScript** (ES6) for application logic
* **[PDF.js](https://mozilla.github.io/pdf.js/)** for offline PDF parsing

### Installation & Usage

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd <repo-root>/round-1A
   ```
2. **Open `index.html`**:

   * Simply open `round-1A/index.html` in your browser (no server required).
   * Or launch with VS Code Live Server:

     1. Install the "Live Server" extension.
     2. Right-click `index.html` → *Open with Live Server*.
3. **Upload or drag & drop** your PDF (≤ 50 pages, ≤ 10 MB).
4. Click **Extract Outline** to generate and download the JSON result.

### Project Structure

```
round-1A/
├── index.html       # Main UI
├── style.css        # Styling and responsive layout
└── app.js           # Core logic: validation, PDF.js integration, outline generation
```

---

## Round 1B: Persona-Driven Document Intelligence

### Description

Processes 3–10 PDF documents against a specified persona and job-to-be-done. Scores and ranks sections by keyword relevance, returning the top insights in JSON format.

### Tech Stack

* **HTML5** & **CSS3** for basic UI
* **Vanilla JavaScript (ES6 modules)**
* **[PDF.js MJS](https://mozilla.github.io/pdf.js/)** for in-browser PDF parsing

### Installation & Usage

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd <repo-root>/round-1B
   ```
2. **Serve the files**:
   Modern browsers enforce module CORS rules, so serve via a static server:

   ```bash
   npx http-server .
   ```

   or use VS Code Live Server.
3. **Navigate** to the served URL (e.g., `http://127.0.0.1:8080`).
4. **Upload 3–10 PDFs**, enter **Persona** and **Job to be‑done**, then click **Analyze Documents**.
5. View or copy the generated JSON output.

### Project Structure

```
round-1B/
├── index.html       # UI form for file upload and inputs
├── styles.css       # Basic styling for form and output
└── app.js           # Logic: text extraction, keyword scoring, JSON formatting
```

---

## Contributing

Contributions are welcome! Please open issues or pull requests to improve functionality, fix bugs, or enhance documentation.

---


