import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Palette,
  RotateCcw,
  Sparkles,
  Eye,
  Code,
  Edit3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table
} from 'lucide-react';
import { formatArticleContent } from '../utils/formatContent';

export const RichTextEditor = ({ content, onChange, onOpenImageModal }) => {
  const [mode, setMode] = useState('visual'); // 'visual' | 'code' | 'preview'
  const editorRef = useRef(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableWithHeader, setTableWithHeader] = useState(true);

  // Sync content from outside into the contentEditable div when mounting or switching modes
  useEffect(() => {
    if (editorRef.current && mode === 'visual') {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content || '';
      }
    }
  }, [mode]);

  const handleInsertTable = () => {
    let html = `<div class="table-responsive-wrapper"><table class="article-table">`;
    if (tableWithHeader) {
      html += '<thead><tr>';
      for (let c = 1; c <= tableCols; c++) {
        html += `<th>Header ${c}</th>`;
      }
      html += '</tr></thead>';
    }
    html += '<tbody>';
    for (let r = 1; r <= tableRows; r++) {
      html += '<tr>';
      for (let c = 1; c <= tableCols; c++) {
        html += `<td>Data ${r}-${c}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table></div><p><br></p>';

    if (editorRef.current && mode === 'visual') {
      editorRef.current.focus();
      const success = document.execCommand('insertHTML', false, html);
      if (!success) {
        editorRef.current.innerHTML += html;
      }
      handleInput();
    } else {
      onChange((content || '') + html);
    }
    setShowTableModal(false);
  };

  // Execute standard formatting commands
  const executeCmd = (command, value = null) => {
    if (mode !== 'visual') return;
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const handleInsertHeading = (tag) => {
    if (tag === 'p') {
      executeCmd('formatBlock', '<p>');
    } else {
      executeCmd('formatBlock', `<${tag}>`);
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Enter link URL (e.g. https://example.com):');
    if (url) {
      executeCmd('createLink', url);
    }
  };

  const handleAutoFormat = () => {
    const formatted = formatArticleContent(content);
    onChange(formatted);
    if (editorRef.current) {
      editorRef.current.innerHTML = formatted;
    }
  };

  const applyColor = (color) => {
    executeCmd('foreColor', color);
    setColorPickerOpen(false);
  };

  const colorPalette = [
    { name: 'Default', hex: 'inherit' },
    { name: 'Sky Blue', hex: '#38bdf8' },
    { name: 'Emerald Green', hex: '#10b981' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Amber Yellow', hex: '#f59e0b' },
    { name: 'Rose Red', hex: '#ef4444' },
    { name: 'White', hex: '#ffffff' }
  ];

  return (
    <div className="rich-editor-container">
      {/* Editor Header / Mode Tabs */}
      <div className="rich-editor-header">
        <div className="rich-editor-mode-tabs">
          <button
            type="button"
            className={`rich-mode-tab ${mode === 'visual' ? 'active' : ''}`}
            onClick={() => setMode('visual')}
            title="Normal visual editing - write naturally like Word/Docs without any code"
          >
            <Edit3 size={15} /> Visual Editor (No Code)
          </button>
          <button
            type="button"
            className={`rich-mode-tab ${mode === 'code' ? 'active' : ''}`}
            onClick={() => setMode('code')}
            title="View or edit raw HTML code"
          >
            <Code size={15} /> HTML Code
          </button>
          <button
            type="button"
            className={`rich-mode-tab ${mode === 'preview' ? 'active' : ''}`}
            onClick={() => setMode('preview')}
            title="Live preview of how the post will look on the blog"
          >
            <Eye size={15} /> Live Preview
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="rich-toolbar-btn auto-format-btn"
            onClick={handleAutoFormat}
            title="Automatically format plain text or pasted ChatGPT response into headings, bullet lists & paragraphs"
          >
            <Sparkles size={14} /> Auto-Format Text
          </button>
        </div>
      </div>

      {/* Visual Toolbar (Only shown in Visual Mode) */}
      {mode === 'visual' && (
        <div className="rich-editor-toolbar">
          {/* Headings */}
          <div className="rich-toolbar-group">
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => handleInsertHeading('h1')}
              title="Main Title Heading (H1)"
            >
              <Heading1 size={16} /> <span className="btn-label">H1</span>
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => handleInsertHeading('h2')}
              title="Large Section Heading (H2)"
            >
              <Heading2 size={16} /> <span className="btn-label">H2</span>
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => handleInsertHeading('h3')}
              title="Subheading (H3)"
            >
              <Heading3 size={16} /> <span className="btn-label">H3</span>
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => handleInsertHeading('p')}
              title="Regular Paragraph text"
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>P</span>
            </button>
          </div>

          <div className="rich-toolbar-divider" />

          {/* Inline Styles */}
          <div className="rich-toolbar-group">
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('underline')}
              title="Underline (Ctrl+U)"
            >
              <Underline size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('strikeThrough')}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </button>
          </div>

          <div className="rich-toolbar-divider" />

          {/* Text Alignment */}
          <div className="rich-toolbar-group">
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('justifyLeft')}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('justifyCenter')}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('justifyRight')}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('justifyFull')}
              title="Justify Text"
            >
              <AlignJustify size={16} />
            </button>
          </div>

          <div className="rich-toolbar-divider" />

          {/* Text Color Picker */}
          <div className="rich-toolbar-group" style={{ position: 'relative' }}>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
              title="Change Text Color"
            >
              <Palette size={16} />
            </button>
            {colorPickerOpen && (
              <div className="color-picker-dropdown">
                {colorPalette.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className="color-circle-btn"
                    style={{ backgroundColor: c.hex === 'inherit' ? 'var(--text-primary)' : c.hex }}
                    onClick={() => applyColor(c.hex)}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rich-toolbar-divider" />

          {/* Lists */}
          <div className="rich-toolbar-group">
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('insertUnorderedList')}
              title="Bullet Points List"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('insertOrderedList')}
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </button>
          </div>

          <div className="rich-toolbar-divider" />

          {/* Blocks: Quote & Divider */}
          <div className="rich-toolbar-group">
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('formatBlock', '<blockquote>')}
              title="Quote Box"
            >
              <Quote size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('insertHorizontalRule')}
              title="Insert Horizontal Divider Line"
            >
              <Minus size={16} />
            </button>
          </div>

          <div className="rich-toolbar-divider" />

          {/* Links & Images */}
          <div className="rich-toolbar-group">
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={handleInsertLink}
              title="Insert Web Link"
            >
              <LinkIcon size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('unlink')}
              title="Remove Link"
            >
              <Unlink size={16} />
            </button>
            <button
              type="button"
              className="rich-toolbar-btn insert-img-btn"
              onClick={onOpenImageModal}
              title="Insert Section Image with upload or link"
            >
              <ImageIcon size={16} /> <span className="btn-label">Insert Image</span>
            </button>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="rich-toolbar-btn insert-table-btn"
                onClick={() => setShowTableModal(!showTableModal)}
                title="Insert Responsive Table"
              >
                <Table size={16} /> <span className="btn-label">Table</span>
              </button>

              {showTableModal && (
                <div className="table-dropdown-modal">
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
                    <span>Insert Table</span>
                    <button
                      type="button"
                      onClick={() => setShowTableModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Rows</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={tableRows}
                        onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                        className="form-input"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Columns</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={tableCols}
                        onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                        className="form-input"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <input
                      type="checkbox"
                      id="table-header-check"
                      checked={tableWithHeader}
                      onChange={(e) => setTableWithHeader(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor="table-header-check" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      Include Header Row
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.4rem', fontSize: '0.82rem', justifyContent: 'center' }}
                    onClick={handleInsertTable}
                  >
                    Insert Table
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="rich-toolbar-divider" />

          {/* Clean / Reset Format */}
          <div className="rich-toolbar-group">
            <button
              type="button"
              className="rich-toolbar-btn"
              onClick={() => executeCmd('removeFormat')}
              title="Clear Formatting from selected text"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Editor Body depending on Active Mode */}
      <div className="rich-editor-body">
        {mode === 'visual' && (
          <div
            ref={editorRef}
            className="rich-editor-canvas article-body"
            contentEditable="true"
            onInput={handleInput}
            onBlur={handleInput}
            data-placeholder="Write your article description and content here naturally (like Microsoft Word or Google Docs - no coding needed!)..."
          />
        )}

        {mode === 'code' && (
          <div className="rich-editor-code-wrapper">
            <div className="code-view-notice">
              <Code size={14} /> HTML Code Mode: Edit raw tags if needed, or switch to Visual Editor above.
            </div>
            <textarea
              className="form-textarea code-textarea"
              rows={15}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="HTML content..."
            />
          </div>
        )}

        {mode === 'preview' && (
          <div className="rich-editor-preview article-body">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>
                Start writing content to see live preview here...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editor Helper Footer */}
      <div className="rich-editor-footer">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {mode === 'visual' && '✏️ Visual Mode: Highlight any text to make it bold, add headings, lists, or colors.'}
          {mode === 'code' && '💻 Code Mode: Direct HTML editing active.'}
          {mode === 'preview' && '👁️ Preview Mode: Viewing post as published on live blog.'}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {(content || '').replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
};
