/**
 * Advanced Utility helper to format raw article text, ChatGPT responses, and plain text
 * into beautifully structured HTML articles with bullet lists, headings, code boxes, and paragraphs.
 */

export const formatArticleContent = (content) => {
  if (!content) return '';

  // If content is already formatted structured HTML (with <p>, <h2>, <ul>, etc.), return as-is
  const hasStructuredHtml = /<\/(p|h1|h2|h3|h4|div|ul|ol|blockquote|table|pre)>/i.test(content);
  if (hasStructuredHtml) {
    return content;
  }

  let text = content.replace(/\r\n/g, '\n').trim();

  // 1. Convert ASCII table/divider lines like -------------------- or ____________________ to <hr />
  text = text.replace(/\n?\s*(-{3,}|_{3,}|\*{3,})\s*\n?/g, '\n\n<hr class="article-hr" />\n\n');

  // 2. Pre-process inline checkmarks (e.g. "provides: ✅ PHP support ✅ MySQL databases ✅ File Manager")
  // Insert line breaks before inline checkmarks/emojis
  text = text.replace(/([^\n])\s*(✅|✔|📌|👉|⚡|•)\s*/g, '$1\n- $2 ');

  // 3. Pre-process inline Key: Value lists (e.g. "Frontend: React Backend: Node.js/Express Database: MySQL")
  text = text.replace(/([^\n])\s*(Frontend|Backend|Database|Image storage|Hosting|Storage|Recommendation|Framework|Security|API):\s*/gi, '$1\n\n**$2:** ');

  // 4. Split text into blocks by double newlines or major structural triggers
  const rawBlocks = text.split(/\n\s*\n/);

  const formattedBlocks = [];

  rawBlocks.forEach((block) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    // Direct HTML elements like <hr class="article-hr" />
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      formattedBlocks.push(trimmed);
      return;
    }

    // Detect database output or ASCII tables (e.g. photo_id | user_id | image_path or 1|101|...)
    if (trimmed.includes('|') && (trimmed.includes('----------------') || /^\d+\s*\|/m.test(trimmed) || /photo_id|user_id|image_path/i.test(trimmed))) {
      const cleanCode = trimmed.replace(/<\/?p>/g, '').trim();
      formattedBlocks.push(`
        <div class="article-code-wrapper">
          <div class="article-code-header"><span>💻 Database Output / Schema</span></div>
          <pre class="article-code-block"><code>${cleanCode}</code></pre>
        </div>
      `);
      return;
    }

    // Detect Markdown headings (# Heading or ## Heading)
    if (/^#{1,6}\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#{1,6}\s+/, '');
      formattedBlocks.push(`<h2 class="article-h2">${headingText}</h2>`);
      return;
    }

    // Detect Section Titles (e.g., "My recommendation", "If you're building a simple photo gallery...", "For a large-scale app:")
    if (
      /^(My recommendation|Recommendation|If you're building|For a large-scale|Key Takeaways|Summary|Overview|Conclusion):?/i.test(trimmed) ||
      (trimmed.length < 70 && !/[.,;!?]$/.test(trimmed) && !trimmed.includes('\n'))
    ) {
      const headingTitle = trimmed.replace(/:$/, '');
      formattedBlocks.push(`<h2 class="article-h2">${headingTitle}</h2>`);
      return;
    }

    // Detect Numbered Section Titles (e.g. "1. Better Career Opportunities" or "2. Improves Productivity")
    if (/^\d+\.\s+[A-Z0-9]/.test(trimmed) && trimmed.length < 100 && !trimmed.includes('\n')) {
      formattedBlocks.push(`<h3 class="article-h3">${trimmed}</h3>`);
      return;
    }

    // Detect Bullet Point Lists (lines starting with -, *, ✅, ✔, 📌, •)
    const lines = trimmed.split('\n');
    const isListBlock = lines.every((line) => {
      const l = line.trim();
      return !l || /^([-*•✅✔📌👉⚡]|\d+\.)\s*/.test(l);
    });

    if (isListBlock && lines.length > 0) {
      const listItems = lines
        .map((line) => {
          const l = line.trim();
          if (!l) return '';
          const cleanedItem = l.replace(/^([-*•✅✔📌👉⚡]|\d+\.)\s*/, '');
          // Bold key-value labels if present (e.g. "Frontend: React")
          const withBoldKey = cleanedItem.replace(/^([^:]+):/, '<strong>$1:</strong>');
          return `<li>${withBoldKey}</li>`;
        })
        .filter(Boolean)
        .join('');

      formattedBlocks.push(`<ul class="article-list">${listItems}</ul>`);
      return;
    }

    // Standard Paragraph: process inline list items or single newlines
    let paragraphContent = trimmed;

    // Highlight key-value pairs inline (e.g. **Frontend:** React)
    paragraphContent = paragraphContent.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    paragraphContent = paragraphContent.replace(/([A-Z][a-zA-Z0-9\s]{2,15}):\s*/g, '<strong>$1:</strong> ');

    // Convert single newlines into <br />
    paragraphContent = paragraphContent.replace(/\n/g, '<br />');

    formattedBlocks.push(`<p>${paragraphContent}</p>`);
  });

  return formattedBlocks.filter(Boolean).join('');
};
