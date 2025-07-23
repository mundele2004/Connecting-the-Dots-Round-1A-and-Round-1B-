import * as pdfjsLib from 'https://mozilla.github.io/pdf.js/build/pdf.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://mozilla.github.io/pdf.js/build/pdf.worker.mjs';

const analyzeBtn = document.getElementById('analyzeBtn');
const pdfInput   = document.getElementById('pdf-input');
const personaIn  = document.getElementById('persona-input');
const jobIn      = document.getElementById('job-input');
const output     = document.getElementById('output');

analyzeBtn.addEventListener('click', async () => {
  const files   = Array.from(pdfInput.files);
  const persona = personaIn.value.trim();
  const job     = jobIn.value.trim();

  if (files.length < 3 || files.length > 10) {
    return alert('Please upload between 3 and 10 PDF files.');
  }
  if (!persona || !job) {
    return alert('Please fill in both Persona and Job‑to‑be‑done.');
  }

  output.textContent = 'Processing…';

  // extract text from each PDF
  async function extractText(file) {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let all = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const txt  = await page.getTextContent();
      const strs = txt.items.map(i => i.str).join(' ');
      all += `\n\n=== Page ${p} ===\n` + strs;
    }
    return all;
  }

  const corpus = [];
  for (let f of files) {
    const text = await extractText(f);
    corpus.push({ name: f.name, text });
  }

  // simple keyword list
  const keywords = (persona + ' ' + job)
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 2);

  // score every page
  let sections = [];
  for (let doc of corpus) {
    const parts = doc.text.split('=== Page ').slice(1);
    for (let chunk of parts) {
      const [hdr, ...rest] = chunk.split(' ');
      const pageNum = parseInt(hdr, 10);
      const content = rest.join(' ');
      let score = 0;
      const low = content.toLowerCase();
      for (let kw of keywords) {
        if (low.includes(kw)) score++;
      }
      if (score > 0) {
        sections.push({ document: doc.name, page: pageNum, text: content, score });
      }
    }
  }

  // rank & take top 10
  sections.sort((a, b) => b.score - a.score);
  const top10 = sections.slice(0, 10);

  // build JSON
  const metadata = {
    documents: files.map(f => f.name),
    persona,
    job_to_be_done: job,
    processing_timestamp: new Date().toISOString()
  };
  const extracted_sections  = [];
  const subsection_analysis = [];

  top10.forEach((sec, idx) => {
    extracted_sections.push({
      document: sec.document,
      page_number: sec.page,
      section_title: `(Page ${sec.page})`,
      importance_rank: idx + 1
    });

    const snippet = sec.text.slice(0, 200).trim();
    subsection_analysis.push({
      document: sec.document,
      subsection_title: `(Page ${sec.page})`,
      refined_text: snippet + (snippet.length < sec.text.length ? '…' : ''),
      page_number: sec.page
    });
  });

  const result = { metadata, extracted_sections, subsection_analysis };
  output.textContent = JSON.stringify(result, null, 2);
});
