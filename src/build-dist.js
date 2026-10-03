const fs = require('fs');
const path = require('path');

const libsCode = fs.readFileSync(path.join(__dirname, '../dist/libs.js'), 'utf8');

// Build using string concatenation to avoid template literal issues
// (libs.js contains backticks and ${} expressions that break template literals)
const PART1 = '/*\n' +
' * qixMarkdownViewer v1.1.0\n' +
' * Markdown Viewer for Qlik Cloud — Theme-aware with WYSIWYG Editor\n' +
' * Released under the MIT license.\n' +
' */\n' +
'\n' +
'!(function (e, t) {\n' +
'  "object" == typeof exports && "undefined" != typeof module\n' +
'    ? (module.exports = t(require("@nebula.js/stardust")))\n' +
'    : "function" == typeof define && define.amd\n' +
'      ? define(["@nebula.js/stardust"], t)\n' +
'      : ((e = "undefined" != typeof globalThis ? globalThis : e || self)[\n' +
'          "qixMarkdownViewer"\n' +
'        ] = t(e.stardust));\n' +
'})(this, function (stardust) {\n' +
'  "use strict";\n' +
'\n' +
'  // === Inline bundled libraries (marked + DOMPurify) ===\n';

const PART2 = '\n  var marked = globalThis.__mdLibs.marked;\n' +
'  var DOMPurify = globalThis.__mdLibs.DOMPurify;\n' +
'  delete globalThis.__mdLibs;\n';

const supernovaCode = PART1 + libsCode + PART2 + `

  // Configure marked
  marked.setOptions({ gfm: true, breaks: true });

  // DOMPurify config
  var purifyConfig = {
    ALLOWED_TAGS: [
      "h1","h2","h3","h4","h5","h6",
      "p","br","hr",
      "ul","ol","li",
      "blockquote","pre","code",
      "table","thead","tbody","tr","th","td",
      "strong","em","del","s","a","img",
      "span","div","sub","sup",
      "input"
    ],
    ALLOWED_ATTR: [
      "href","target","rel","src","alt","title",
      "class","id",
      "checked","disabled","type",
      "align","colspan","rowspan"
    ],
    ALLOW_DATA_ATTR: false
  };

  // =====================================================
  //  CSS — Viewer + Modal Editor
  // =====================================================
  var CSS = [
    // --- Viewer styles ---
    ".qix-markdown-viewer{width:100%;height:100%;overflow-y:auto;overflow-x:hidden;box-sizing:border-box;line-height:1.6;word-wrap:break-word;overflow-wrap:break-word;color:var(--md-text-color,#333333);}",
    ".qix-markdown-viewer h1,.qix-markdown-viewer h2,.qix-markdown-viewer h3,.qix-markdown-viewer h4,.qix-markdown-viewer h5,.qix-markdown-viewer h6{margin-top:1em;margin-bottom:0.5em;font-weight:600;line-height:1.3;color:var(--md-heading-color,inherit);}",
    ".qix-markdown-viewer h1{font-size:2em;border-bottom:1px solid var(--md-border-color,#e0e0e0);padding-bottom:0.3em;}",
    ".qix-markdown-viewer h2{font-size:1.5em;border-bottom:1px solid var(--md-border-color,#e0e0e0);padding-bottom:0.25em;}",
    ".qix-markdown-viewer h3{font-size:1.25em;}",
    ".qix-markdown-viewer h4{font-size:1.1em;}",
    ".qix-markdown-viewer h5{font-size:1em;}",
    ".qix-markdown-viewer h6{font-size:0.9em;color:var(--md-muted-color,#666);}",
    ".qix-markdown-viewer h1:first-child,.qix-markdown-viewer h2:first-child,.qix-markdown-viewer h3:first-child{margin-top:0;}",
    ".qix-markdown-viewer p{margin:0 0 1em 0;}",
    ".qix-markdown-viewer a{color:var(--md-link-color,#0073e6);text-decoration:none;}",
    ".qix-markdown-viewer a:hover{text-decoration:underline;}",
    ".qix-markdown-viewer ul,.qix-markdown-viewer ol{margin:0 0 1em 0;padding-left:2em;}",
    ".qix-markdown-viewer li{margin-bottom:0.25em;}",
    ".qix-markdown-viewer li>ul,.qix-markdown-viewer li>ol{margin-top:0.25em;margin-bottom:0;}",
    ".qix-markdown-viewer li input[type=checkbox]{margin-right:0.4em;vertical-align:middle;}",
    ".qix-markdown-viewer blockquote{margin:0 0 1em 0;padding:0.5em 1em;border-left:4px solid var(--md-accent-color, var(--md-link-color,#0073e6));background:var(--md-blockquote-bg,rgba(0,115,230,0.05));}",
    ".qix-markdown-viewer blockquote p:last-child{margin-bottom:0;}",
    ".qix-markdown-viewer code{font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:0.875em;background:var(--md-code-bg,#f4f4f8);padding:0.15em 0.4em;border-radius:3px;color:var(--md-code-color,inherit);}",
    ".qix-markdown-viewer pre{margin:0 0 1em 0;padding:1em;background:var(--md-code-bg,#f4f4f8);border-radius:6px;overflow-x:auto;line-height:1.45;}",
    ".qix-markdown-viewer pre code{background:none;padding:0;font-size:0.85em;}",
    ".qix-markdown-viewer table{border-collapse:collapse;width:100%;margin:0 0 1em 0;font-size:0.95em;}",
    ".qix-markdown-viewer th,.qix-markdown-viewer td{border:1px solid var(--md-border-color,#ddd);padding:0.5em 0.75em;text-align:left;}",
    ".qix-markdown-viewer th{background:var(--md-code-bg,#f4f4f8);font-weight:600;}",
    ".qix-markdown-viewer tr:nth-child(even){background:var(--md-stripe-bg,rgba(0,0,0,0.02));}",
    ".qix-markdown-viewer hr{border:none;border-top:1px solid var(--md-border-color,#e0e0e0);margin:1.5em 0;}",
    ".qix-markdown-viewer img{max-width:100%;height:auto;border-radius:4px;}",
    ".qix-markdown-viewer strong{font-weight:700;}",
    ".qix-markdown-viewer em{font-style:italic;}",
    ".qix-markdown-viewer del,.qix-markdown-viewer s{text-decoration:line-through;opacity:0.7;}",
    ".qix-markdown-viewer::-webkit-scrollbar{width:6px;}",
    ".qix-markdown-viewer::-webkit-scrollbar-track{background:transparent;}",
    ".qix-markdown-viewer::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:3px;}",
    ".qix-markdown-viewer::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.3);}",

    // --- Modal Editor styles ---
    ".qix-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:100000;display:flex;align-items:center;justify-content:center;animation:qixFadeIn .15s ease;}",
    "@keyframes qixFadeIn{from{opacity:0}to{opacity:1}}",
    ".qix-modal{background:#fff;border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,0.2);width:90vw;height:85vh;max-width:1400px;display:flex;flex-direction:column;overflow:hidden;font-family:'Source Sans Pro',sans-serif;color:#595959;}",

    // Modal header
    ".qix-modal-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #ccc;background:#fff;flex-shrink:0;}",
    ".qix-modal-title{font-size:14px;font-weight:600;color:#404040;margin:0;}",
    ".qix-modal-close{width:28px;height:28px;border:none;background:none;cursor:pointer;border-radius:3px;display:flex;align-items:center;justify-content:center;color:#595959;font-size:18px;line-height:1;}",
    ".qix-modal-close:hover{background:#e8e8e8;color:#404040;}",

    // Modal body — 3-column layout
    ".qix-modal-body{display:flex;flex:1;overflow:hidden;}",

    // Left sidebar — Dimensions & Measures
    ".qix-modal-sidebar{width:260px;border-right:1px solid #ccc;display:flex;flex-direction:column;background:#f9f9f9;flex-shrink:0;}",
    ".qix-sidebar-header{padding:12px 16px 8px;font-size:11px;font-weight:600;color:#595959;text-transform:uppercase;letter-spacing:0.5px;font-family:'Source Sans Pro',sans-serif;}",
    ".qix-sidebar-search{margin:0 12px 8px;padding:3px 8px;border:1px solid #b3b3b3;border-radius:3px;font-size:13px;font-family:'Source Sans Pro',sans-serif;outline:none;box-sizing:border-box;width:calc(100% - 24px);height:28px;color:#595959;}",
    ".qix-sidebar-search:focus{border-color:#52a8ec;}",
    ".qix-sidebar-list{flex:1;overflow-y:auto;padding:0 8px 8px;}",
    ".qix-sidebar-section{margin-bottom:12px;}",
    ".qix-sidebar-section-title{font-size:11px;font-weight:600;color:#888;padding:4px 8px;text-transform:uppercase;letter-spacing:0.3px;}",
    ".qix-sidebar-item{display:flex;align-items:center;padding:6px 10px;border-radius:3px;cursor:grab;font-size:13px;color:#404040;gap:8px;user-select:none;margin:1px 0;font-family:'Source Sans Pro',sans-serif;}",
    ".qix-sidebar-item:hover{background:#e8f0fe;}",
    ".qix-sidebar-item.dragging{opacity:0.5;background:#d0e0ff;}",
    ".qix-sidebar-icon{width:16px;height:16px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border-radius:3px;color:#fff;}",
    ".qix-sidebar-icon.dim{background:#52a8ec;}",
    ".qix-sidebar-icon.msr{background:#66bb6a;}",
    ".qix-sidebar-item-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}",
    ".qix-sidebar-item-expr{font-size:10px;color:#888;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px;}",
    ".qix-sidebar-empty{padding:12px 16px;font-size:12px;color:#999;font-style:italic;}",

    // Editor area
    ".qix-modal-editor{flex:1;display:flex;flex-direction:column;overflow:hidden;}",

    // Toolbar
    ".qix-toolbar{display:flex;align-items:center;padding:6px 12px;border-bottom:1px solid #ccc;background:#f9f9f9;flex-wrap:wrap;gap:2px;flex-shrink:0;}",
    ".qix-toolbar-btn{width:30px;height:28px;border:none;background:none;cursor:pointer;border-radius:3px;display:flex;align-items:center;justify-content:center;color:#595959;font-size:13px;font-weight:600;position:relative;font-family:'Source Sans Pro',sans-serif;}",
    ".qix-toolbar-btn:hover{background:#e0e0e0;color:#404040;}",
    ".qix-toolbar-btn.active{background:#d0e0ff;color:#1a73e8;}",
    ".qix-toolbar-sep{width:1px;height:20px;background:#ddd;margin:0 4px;}",
    ".qix-toolbar-btn svg{width:16px;height:16px;}",
    ".qix-toolbar-btn[title]:hover::after{content:attr(title);position:absolute;bottom:-26px;left:50%;transform:translateX(-50%);background:#333;color:#fff;font-size:10px;font-weight:400;padding:3px 8px;border-radius:3px;white-space:nowrap;z-index:10;pointer-events:none;}",

    // Editor + Preview split
    ".qix-editor-split{display:flex;flex:1;overflow:hidden;}",
    ".qix-editor-pane{flex:1;display:flex;flex-direction:column;overflow:hidden;}",
    ".qix-editor-pane-label{font-size:11px;font-weight:600;color:#595959;text-transform:uppercase;letter-spacing:0.3px;padding:6px 12px;border-bottom:1px solid #ccc;background:#f9f9f9;flex-shrink:0;font-family:'Source Sans Pro',sans-serif;}",
    ".qix-editor-textarea{flex:1;border:none;resize:none;padding:12px 16px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:13px;line-height:1.6;outline:none;color:#404040;background:#fff;overflow-y:auto;tab-size:2;}",
    ".qix-editor-textarea.drag-over{background:#f0f7ff;outline:2px dashed #52a8ec;outline-offset:-4px;caret-color:#52a8ec;cursor:text !important;}",
    ".qix-editor-divider{width:1px;background:#ccc;flex-shrink:0;cursor:col-resize;}",
    ".qix-editor-divider:hover{background:#52a8ec;width:3px;}",
    ".qix-preview-pane{flex:1;overflow-y:auto;padding:12px 16px;background:#fff;}",

    // Modal footer — Qlik lui-button styling
    ".qix-modal-footer{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid #ccc;background:#fff;flex-shrink:0;}",
    ".qix-modal-footer-info{font-size:12px;color:#888;font-family:'Source Sans Pro',sans-serif;}",
    ".qix-modal-footer-actions{display:flex;gap:8px;}",
    ".qix-btn{height:32px;padding:0 16px;border-radius:3px;font-size:13px;font-weight:600;font-family:'Source Sans Pro',sans-serif;cursor:pointer;border:1px solid #b3b3b3;background:transparent;color:#595959;transition:background .15s ease;line-height:30px;text-align:center;box-sizing:border-box;}",
    ".qix-btn:hover{background:rgba(0,0,0,0.03);}",
    ".qix-btn-primary{background:#009845;color:#fff;border-color:#009845;}",
    ".qix-btn-primary:hover{background:#007a38;}",

    // Expression tag styling in textarea (visual cue via preview only)
    ".qix-expr-tag{display:inline;background:#e8f0fe;border:1px solid #c4d7f5;border-radius:3px;padding:1px 4px;font-family:monospace;font-size:0.85em;color:#1a73e8;white-space:nowrap;}",

    // --- Media Library modal ---
    ".qix-media-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:200000;display:flex;align-items:center;justify-content:center;animation:qixFadeIn .15s ease;}",
    ".qix-media-modal{background:#fff;border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,0.25);width:70vw;height:70vh;max-width:960px;max-height:640px;display:flex;flex-direction:column;overflow:hidden;font-family:'Source Sans Pro',sans-serif;color:#595959;}",
    ".qix-media-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #ccc;background:#fff;flex-shrink:0;}",
    ".qix-media-title{font-size:14px;font-weight:600;color:#404040;}",
    ".qix-media-body{display:flex;flex:1;overflow:hidden;}",
    ".qix-media-grid-wrap{flex:1;overflow-y:auto;padding:16px;}",
    ".qix-media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px;}",
    ".qix-media-item{border:2px solid transparent;border-radius:4px;cursor:pointer;display:flex;flex-direction:column;align-items:center;padding:8px;transition:border-color .15s,background .15s;}",
    ".qix-media-item:hover{background:#f0f7ff;border-color:#b3d4fc;}",
    ".qix-media-item.selected{border-color:#52a8ec;background:#e8f4fd;}",
    ".qix-media-thumb{width:100%;aspect-ratio:1;object-fit:contain;border-radius:3px;background:#f5f5f5;}",
    ".qix-media-name{font-size:11px;color:#595959;margin-top:6px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;word-break:break-all;}",
    ".qix-media-preview{width:320px;border-left:1px solid #ccc;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;background:#fafafa;flex-shrink:0;}",
    ".qix-media-preview-img{max-width:100%;max-height:60%;object-fit:contain;border-radius:4px;background:#f0f0f0;}",
    ".qix-media-preview-name{font-size:13px;font-weight:600;color:#404040;margin-top:12px;text-align:center;word-break:break-all;}",
    ".qix-media-preview-info{font-size:11px;color:#888;margin-top:4px;}",
    ".qix-media-preview-empty{font-size:13px;color:#999;font-style:italic;}",
    ".qix-media-footer{display:flex;align-items:center;justify-content:flex-end;padding:10px 16px;border-top:1px solid #ccc;background:#fff;flex-shrink:0;gap:8px;}",
    ".qix-media-empty{padding:40px;text-align:center;color:#999;font-size:13px;font-style:italic;grid-column:1/-1;}",
    // --- Copy confirmation toast ---
    ".qix-md-copy-toast{position:absolute;right:8px;bottom:8px;z-index:10;padding:4px 10px;border-radius:4px;background:rgba(0,0,0,0.72);color:#fff;font-size:12px;line-height:1.4;pointer-events:none;opacity:1;transition:opacity 0.4s ease;}"
  ].join("\\n");

  var cssInjected = false;
  function injectCSS() {
    if (cssInjected) return;
    var s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    cssInjected = true;
  }

  // =====================================================
  //  SVG Icons for the toolbar
  // =====================================================
  var ICONS = {
    bold:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/></svg>',
    italic:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>',
    strike:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M16 4H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H8"/><line x1="4" y1="12" x2="20" y2="12"/></svg>',
    h1:         '<b style="font-size:13px">H1</b>',
    h2:         '<b style="font-size:12px">H2</b>',
    h3:         '<b style="font-size:11px">H3</b>',
    link:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    image:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    ul:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="5" cy="6" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="18" r="1" fill="currentColor"/></svg>',
    ol:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/><text x="3" y="8" font-size="8" fill="currentColor" stroke="none" font-weight="700">1</text><text x="3" y="14" font-size="8" fill="currentColor" stroke="none" font-weight="700">2</text><text x="3" y="20" font-size="8" fill="currentColor" stroke="none" font-weight="700">3</text></svg>',
    tasklist:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="6" height="6" rx="1"/><path d="M4.5 8l1.5 1.5 3-3"/><line x1="12" y1="7" x2="21" y2="7"/><rect x="3" y="14" width="6" height="6" rx="1"/><line x1="12" y1="17" x2="21" y2="17"/></svg>',
    code:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    codeblock:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="10 8 6 12 10 16"/><polyline points="14 8 18 12 14 16"/></svg>',
    quote:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>',
    table:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
    hr:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="2" y1="12" x2="22" y2="12"/></svg>'
  };

  // =====================================================
  //  Toolbar action definitions
  // =====================================================
  function applyToolbarAction(ta, action) {
    var start = ta.selectionStart;
    var end = ta.selectionEnd;
    var text = ta.value;
    var sel = text.substring(start, end);
    var before = text.substring(0, start);
    var after = text.substring(end);
    var result, newCursorStart, newCursorEnd;

    switch (action) {
      case "bold":
        result = before + "**" + (sel || "bold text") + "**" + after;
        newCursorStart = start + 2;
        newCursorEnd = start + 2 + (sel || "bold text").length;
        break;
      case "italic":
        result = before + "*" + (sel || "italic text") + "*" + after;
        newCursorStart = start + 1;
        newCursorEnd = start + 1 + (sel || "italic text").length;
        break;
      case "strike":
        result = before + "~~" + (sel || "strikethrough") + "~~" + after;
        newCursorStart = start + 2;
        newCursorEnd = start + 2 + (sel || "strikethrough").length;
        break;
      case "h1":
        var lineStart1 = before.lastIndexOf("\\n") + 1;
        result = text.substring(0, lineStart1) + "# " + text.substring(lineStart1);
        newCursorStart = start + 2; newCursorEnd = end + 2;
        break;
      case "h2":
        var lineStart2 = before.lastIndexOf("\\n") + 1;
        result = text.substring(0, lineStart2) + "## " + text.substring(lineStart2);
        newCursorStart = start + 3; newCursorEnd = end + 3;
        break;
      case "h3":
        var lineStart3 = before.lastIndexOf("\\n") + 1;
        result = text.substring(0, lineStart3) + "### " + text.substring(lineStart3);
        newCursorStart = start + 4; newCursorEnd = end + 4;
        break;
      case "link":
        if (sel) {
          result = before + "[" + sel + "](url)" + after;
          newCursorStart = end + 2; newCursorEnd = end + 5;
        } else {
          result = before + "[link text](url)" + after;
          newCursorStart = start + 1; newCursorEnd = start + 10;
        }
        break;
      case "image":
        result = before + "![alt text](image-url)" + after;
        newCursorStart = start + 2; newCursorEnd = start + 10;
        break;
      case "ul":
        if (sel) {
          var items = sel.split("\\n").map(function(l) { return "- " + l; }).join("\\n");
          result = before + items + after;
          newCursorStart = start; newCursorEnd = start + items.length;
        } else {
          result = before + "- list item\\n" + after;
          newCursorStart = start + 2; newCursorEnd = start + 11;
        }
        break;
      case "ol":
        if (sel) {
          var oitems = sel.split("\\n").map(function(l, i) { return (i+1) + ". " + l; }).join("\\n");
          result = before + oitems + after;
          newCursorStart = start; newCursorEnd = start + oitems.length;
        } else {
          result = before + "1. list item\\n" + after;
          newCursorStart = start + 3; newCursorEnd = start + 12;
        }
        break;
      case "tasklist":
        result = before + "- [ ] task item\\n" + after;
        newCursorStart = start + 6; newCursorEnd = start + 15;
        break;
      case "code":
        result = before + "\\u0060" + (sel || "code") + "\\u0060" + after;
        newCursorStart = start + 1;
        newCursorEnd = start + 1 + (sel || "code").length;
        break;
      case "codeblock":
        result = before + "\\u0060\\u0060\\u0060\\n" + (sel || "code here") + "\\n\\u0060\\u0060\\u0060" + after;
        newCursorStart = start + 4;
        newCursorEnd = start + 4 + (sel || "code here").length;
        break;
      case "quote":
        if (sel) {
          var qlines = sel.split("\\n").map(function(l) { return "> " + l; }).join("\\n");
          result = before + qlines + after;
          newCursorStart = start; newCursorEnd = start + qlines.length;
        } else {
          result = before + "> quote text" + after;
          newCursorStart = start + 2; newCursorEnd = start + 12;
        }
        break;
      case "table":
        var tbl = "| Header 1 | Header 2 | Header 3 |\\n| --- | --- | --- |\\n| Cell 1 | Cell 2 | Cell 3 |\\n";
        result = before + "\\n" + tbl + after;
        newCursorStart = start + 3; newCursorEnd = start + 11;
        break;
      case "hr":
        result = before + "\\n---\\n" + after;
        newCursorStart = start + 5; newCursorEnd = start + 5;
        break;
      default:
        return;
    }

    ta.value = result;
    ta.selectionStart = newCursorStart;
    ta.selectionEnd = newCursorEnd;
    ta.focus();
    ta.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // =====================================================
  //  Media Library Modal
  // =====================================================
  function openMediaLibrary(onInsert) {
    injectCSS();

    // Extract app ID from the current page URL
    var appMatch = location.pathname.match(new RegExp("app/([^/]+)"));
    if (!appMatch) {
      alert("Could not detect app ID from the current URL.");
      return;
    }
    var appId = appMatch[1];
    var selectedItem = null;

    // --- Build DOM ---
    var overlay = document.createElement("div");
    overlay.className = "qix-media-overlay";

    var modal = document.createElement("div");
    modal.className = "qix-media-modal";

    // Header
    var header = document.createElement("div");
    header.className = "qix-media-header";
    header.innerHTML = '<div class="qix-media-title">Media library</div>' +
      '<button class="qix-modal-close" title="Close">&times;</button>';

    // Body
    var body = document.createElement("div");
    body.className = "qix-media-body";

    var gridWrap = document.createElement("div");
    gridWrap.className = "qix-media-grid-wrap";
    var grid = document.createElement("div");
    grid.className = "qix-media-grid";
    grid.innerHTML = '<div class="qix-media-empty">Loading images...</div>';
    gridWrap.appendChild(grid);

    var preview = document.createElement("div");
    preview.className = "qix-media-preview";
    preview.innerHTML = '<div class="qix-media-preview-empty">Select an image to preview</div>';

    body.appendChild(gridWrap);
    body.appendChild(preview);

    // Footer
    var footer = document.createElement("div");
    footer.className = "qix-media-footer";
    var closeBtn = document.createElement("button");
    closeBtn.className = "qix-btn";
    closeBtn.textContent = "Close";
    var insertBtn = document.createElement("button");
    insertBtn.className = "qix-btn qix-btn-primary";
    insertBtn.textContent = "Insert";
    insertBtn.disabled = true;
    insertBtn.style.opacity = "0.5";
    footer.appendChild(closeBtn);
    footer.appendChild(insertBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function closeModal() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    header.querySelector(".qix-modal-close").addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) closeModal();
    });

    insertBtn.addEventListener("click", function() {
      if (selectedItem) {
        onInsert(selectedItem.name, selectedItem.link);
        closeModal();
      }
    });

    function selectItem(item, el) {
      selectedItem = item;
      // Update grid selection
      var prev = grid.querySelector(".selected");
      if (prev) prev.classList.remove("selected");
      el.classList.add("selected");
      // Update preview
      preview.innerHTML = '';
      var img = document.createElement("img");
      img.className = "qix-media-preview-img";
      img.src = item.link;
      img.alt = item.name;
      var name = document.createElement("div");
      name.className = "qix-media-preview-name";
      name.textContent = item.name;
      preview.appendChild(img);
      preview.appendChild(name);
      // Enable insert button
      insertBtn.disabled = false;
      insertBtn.style.opacity = "1";
    }

    // Fetch media list
    fetch("/api/v1/apps/" + appId + "/media/list", {
      headers: { "Accept": "application/json" }
    }).then(function(r) { return r.json(); }).then(function(data) {
      var items = (data.data || []).filter(function(f) { return f.type === "image"; });
      grid.innerHTML = "";
      if (items.length === 0) {
        grid.innerHTML = '<div class="qix-media-empty">No images found in this app.</div>';
        return;
      }
      // Section header
      var sectionLabel = document.createElement("div");
      sectionLabel.style.cssText = "grid-column:1/-1;font-size:12px;font-weight:600;color:#595959;padding:0 0 4px;font-family:Source Sans Pro,sans-serif;";
      sectionLabel.textContent = "In app (" + items.length + ")";
      grid.appendChild(sectionLabel);

      items.forEach(function(item) {
        var card = document.createElement("div");
        card.className = "qix-media-item";
        var thumb = document.createElement("img");
        thumb.className = "qix-media-thumb";
        thumb.src = item.link;
        thumb.alt = item.name;
        thumb.loading = "lazy";
        var label = document.createElement("div");
        label.className = "qix-media-name";
        label.textContent = item.name;
        label.title = item.name;
        card.appendChild(thumb);
        card.appendChild(label);
        card.addEventListener("click", function() { selectItem(item, card); });
        card.addEventListener("dblclick", function() {
          selectItem(item, card);
          onInsert(item.name, item.link);
          closeModal();
        });
        grid.appendChild(card);
      });
    }).catch(function(err) {
      grid.innerHTML = '<div class="qix-media-empty">Failed to load media library: ' + err.message + '</div>';
    });
  }

  // =====================================================
  //  Modal Editor
  // =====================================================
  function openEditorModal(options) {
    // options: { markdown, app, onSave, onCancel }
    injectCSS();

    var currentMarkdown = options.markdown || "";
    var dimensions = [];
    var measures = [];

    // --- Create DOM ---
    var overlay = document.createElement("div");
    overlay.className = "qix-modal-overlay";

    var modal = document.createElement("div");
    modal.className = "qix-modal";

    // -- Header --
    var header = document.createElement("div");
    header.className = "qix-modal-header";
    header.innerHTML = '<div class="qix-modal-title">Markdown Editor</div>' +
      '<button class="qix-modal-close" title="Close">&times;</button>';

    // -- Body --
    var body = document.createElement("div");
    body.className = "qix-modal-body";

    // Left sidebar
    var sidebar = document.createElement("div");
    sidebar.className = "qix-modal-sidebar";
    sidebar.innerHTML =
      '<div class="qix-sidebar-header">Dimensions & Measures</div>' +
      '<input type="text" class="qix-sidebar-search" placeholder="Search fields..." />' +
      '<div class="qix-sidebar-list">' +
        '<div class="qix-sidebar-empty">Loading fields...</div>' +
      '</div>';

    // Editor area
    var editorArea = document.createElement("div");
    editorArea.className = "qix-modal-editor";

    // Toolbar
    var toolbar = document.createElement("div");
    toolbar.className = "qix-toolbar";

    var toolbarItems = [
      { action: "bold", icon: "bold", title: "Bold (Ctrl+B)" },
      { action: "italic", icon: "italic", title: "Italic (Ctrl+I)" },
      { action: "strike", icon: "strike", title: "Strikethrough" },
      "sep",
      { action: "h1", icon: "h1", title: "Heading 1" },
      { action: "h2", icon: "h2", title: "Heading 2" },
      { action: "h3", icon: "h3", title: "Heading 3" },
      "sep",
      { action: "link", icon: "link", title: "Link" },
      { action: "image", icon: "image", title: "Image" },
      "sep",
      { action: "ul", icon: "ul", title: "Bullet List" },
      { action: "ol", icon: "ol", title: "Numbered List" },
      { action: "tasklist", icon: "tasklist", title: "Task List" },
      "sep",
      { action: "code", icon: "code", title: "Inline Code" },
      { action: "codeblock", icon: "codeblock", title: "Code Block" },
      { action: "quote", icon: "quote", title: "Blockquote" },
      "sep",
      { action: "table", icon: "table", title: "Table" },
      { action: "hr", icon: "hr", title: "Horizontal Rule" }
    ];

    toolbarItems.forEach(function(item) {
      if (item === "sep") {
        var sep = document.createElement("div");
        sep.className = "qix-toolbar-sep";
        toolbar.appendChild(sep);
      } else {
        var btn = document.createElement("button");
        btn.className = "qix-toolbar-btn";
        btn.setAttribute("data-action", item.action);
        btn.setAttribute("title", item.title);
        btn.innerHTML = ICONS[item.icon] || item.icon;
        toolbar.appendChild(btn);
      }
    });

    // Editor + Preview split
    var split = document.createElement("div");
    split.className = "qix-editor-split";

    var editorPane = document.createElement("div");
    editorPane.className = "qix-editor-pane";
    editorPane.innerHTML = '<div class="qix-editor-pane-label">Markdown</div>';

    var textarea = document.createElement("textarea");
    textarea.className = "qix-editor-textarea";
    textarea.value = currentMarkdown;
    textarea.setAttribute("spellcheck", "false");
    textarea.setAttribute("placeholder", "Type your markdown here...\\n\\nDrag dimensions or measures from the left panel to insert dynamic expressions.");
    editorPane.appendChild(textarea);

    var divider = document.createElement("div");
    divider.className = "qix-editor-divider";

    var previewPane = document.createElement("div");
    previewPane.className = "qix-editor-pane";
    previewPane.innerHTML = '<div class="qix-editor-pane-label">Preview</div>';

    var previewContent = document.createElement("div");
    previewContent.className = "qix-preview-pane qix-markdown-viewer";
    previewPane.appendChild(previewContent);

    split.appendChild(editorPane);
    split.appendChild(divider);
    split.appendChild(previewPane);

    editorArea.appendChild(toolbar);
    editorArea.appendChild(split);

    body.appendChild(sidebar);
    body.appendChild(editorArea);

    // -- Footer --
    var footer = document.createElement("div");
    footer.className = "qix-modal-footer";
    footer.innerHTML =
      '<div class="qix-modal-footer-info"><span class="qix-char-count">' + currentMarkdown.length + '</span> characters</div>' +
      '<div class="qix-modal-footer-actions">' +
        '<button class="qix-btn qix-btn-cancel">Cancel</button>' +
        '<button class="qix-btn qix-btn-primary qix-btn-save">Save</button>' +
      '</div>';

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // --- Focus textarea ---
    setTimeout(function() { textarea.focus(); }, 100);

    // --- Preview updater ---
    function updatePreview() {
      var md = textarea.value;
      // Highlight master item references in preview — show as nice tags with title
      var previewMd = md.replace(/\\$\\{\\{(dim|msr):([^:]+):([\\s\\S]+?)\\}\\}/g, function(match, type, id, title) {
        var icon = type === "dim" ? "D" : "M";
        var color = type === "dim" ? "#52a8ec" : "#66bb6a";
        return '<span class="qix-expr-tag" style="border-color:' + color + ';"><span style="background:' + color + ';color:#fff;padding:0 4px;border-radius:2px;margin-right:4px;font-size:9px;font-weight:700;">' + icon + '</span>' + title + '</span>';
      });
      // Also highlight legacy direct expression placeholders
      previewMd = previewMd.replace(/\\$\\{\\{=([\\s\\S]+?)\\}\\}/g, '<span class="qix-expr-tag">\\$\\{\\{=$1\\}\\}</span>');
      var rawHtml = marked.parse(previewMd || "");
      var cleanHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: purifyConfig.ALLOWED_TAGS.concat(["span"]),
        ALLOWED_ATTR: purifyConfig.ALLOWED_ATTR.concat(["class", "style"]),
        ALLOW_DATA_ATTR: false
      });
      previewContent.innerHTML = cleanHtml;

      // Update char count
      var counter = footer.querySelector(".qix-char-count");
      if (counter) counter.textContent = md.length;
    }

    updatePreview();

    // Live preview on input
    var previewTimer = null;
    textarea.addEventListener("input", function() {
      clearTimeout(previewTimer);
      previewTimer = setTimeout(updatePreview, 150);
    });

    // --- Toolbar clicks ---
    toolbar.addEventListener("click", function(e) {
      var btn = e.target.closest(".qix-toolbar-btn");
      if (!btn) return;
      var action = btn.getAttribute("data-action");
      if (action === "image") {
        // Open media library instead of inserting plain placeholder
        openMediaLibrary(function(name, url) {
          var pos = textarea.selectionStart || textarea.value.length;
          var before = textarea.value.substring(0, pos);
          var after = textarea.value.substring(pos);
          var imgTag = "![" + name + "](" + url + ")";
          textarea.value = before + imgTag + after;
          textarea.selectionStart = textarea.selectionEnd = pos + imgTag.length;
          textarea.focus();
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          updatePreview();
        });
        return;
      }
      if (action) {
        applyToolbarAction(textarea, action);
        updatePreview();
      }
    });

    // --- Keyboard shortcuts ---
    textarea.addEventListener("keydown", function(e) {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === "b") { e.preventDefault(); applyToolbarAction(textarea, "bold"); updatePreview(); }
        if (e.key === "i") { e.preventDefault(); applyToolbarAction(textarea, "italic"); updatePreview(); }
        if (e.key === "k") { e.preventDefault(); applyToolbarAction(textarea, "link"); updatePreview(); }
      }
      // Tab key inserts 2 spaces
      if (e.key === "Tab") {
        e.preventDefault();
        var s = textarea.selectionStart;
        textarea.value = textarea.value.substring(0, s) + "  " + textarea.value.substring(textarea.selectionEnd);
        textarea.selectionStart = textarea.selectionEnd = s + 2;
        updatePreview();
      }
    });

    // --- Drag & Drop from sidebar ---

    // Drop indicator: a bright blue vertical line with dots, positioned over textarea
    var dropLine = document.createElement("div");
    dropLine.style.cssText = "position:absolute;width:2px;height:0;background:#52a8ec;pointer-events:none;display:none;z-index:10;border-radius:1px;box-shadow:0 0 8px rgba(82,168,236,0.8),0 0 3px rgba(82,168,236,0.5);";
    var dropLineDot = document.createElement("div");
    dropLineDot.style.cssText = "position:absolute;top:-4px;left:-4px;width:10px;height:10px;background:#52a8ec;border-radius:50%;pointer-events:none;box-shadow:0 0 4px rgba(82,168,236,0.6);";
    dropLine.appendChild(dropLineDot);
    var dropLineDotB = document.createElement("div");
    dropLineDotB.style.cssText = "position:absolute;bottom:-4px;left:-4px;width:10px;height:10px;background:#52a8ec;border-radius:50%;pointer-events:none;box-shadow:0 0 4px rgba(82,168,236,0.6);";
    dropLine.appendChild(dropLineDotB);
    editorPane.style.position = "relative";
    editorPane.appendChild(dropLine);

    // Measure char width for the textarea monospace font (done once)
    var _charMetrics = null;
    function getCharMetrics(ta) {
      if (_charMetrics) return _charMetrics;
      var cs = window.getComputedStyle(ta);
      var span = document.createElement("span");
      span.style.cssText = "position:absolute;left:-9999px;top:-9999px;white-space:pre;";
      span.style.fontFamily = cs.fontFamily;
      span.style.fontSize = cs.fontSize;
      span.style.fontWeight = cs.fontWeight;
      span.style.letterSpacing = cs.letterSpacing;
      span.textContent = "MMMMMMMMMM";
      document.body.appendChild(span);
      var w = span.getBoundingClientRect().width / 10;
      document.body.removeChild(span);
      var lh = parseFloat(cs.lineHeight);
      if (isNaN(lh)) lh = parseFloat(cs.fontSize) * 1.6;
      var padTop = parseFloat(cs.paddingTop) || 0;
      var padLeft = parseFloat(cs.paddingLeft) || 0;
      _charMetrics = { charW: w, lineH: lh, padTop: padTop, padLeft: padLeft };
      return _charMetrics;
    }

    // Split text into visual lines as the textarea wraps them
    function getVisualLines(ta) {
      var text = ta.value;
      var cs = window.getComputedStyle(ta);
      var contentW = ta.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      var m = getCharMetrics(ta);
      var charsPerLine = Math.floor(contentW / m.charW) || 80;

      var lines = [];
      var hardLines = text.split("\\n");
      var offset = 0;
      for (var i = 0; i < hardLines.length; i++) {
        var hl = hardLines[i];
        if (hl.length === 0) {
          lines.push({ start: offset, length: 0 });
        } else {
          var pos = 0;
          while (pos < hl.length) {
            var chunk = Math.min(charsPerLine, hl.length - pos);
            lines.push({ start: offset + pos, length: chunk });
            pos += chunk;
          }
        }
        offset += hl.length + 1; // +1 for the newline
      }
      return lines;
    }

    // Convert mouse (clientX, clientY) to a text offset in the textarea
    function mouseToOffset(ta, clientX, clientY) {
      var taRect = ta.getBoundingClientRect();
      var m = getCharMetrics(ta);
      var lines = getVisualLines(ta);

      // Mouse position relative to textarea content area
      var relY = clientY - taRect.top - m.padTop + ta.scrollTop;
      var relX = clientX - taRect.left - m.padLeft;

      // Which visual line?
      var lineIdx = Math.max(0, Math.min(Math.floor(relY / m.lineH), lines.length - 1));
      var line = lines[lineIdx];

      // Which column?
      var col = Math.max(0, Math.min(Math.round(relX / m.charW), line.length));

      return Math.min(line.start + col, ta.value.length);
    }

    // Position the drop line at the mouse location directly (no offset calculation needed for visual)
    function showDropLineAtMouse(ta, clientX, clientY) {
      var taRect = ta.getBoundingClientRect();
      var paneRect = editorPane.getBoundingClientRect();
      var m = getCharMetrics(ta);

      // Clamp mouse to textarea bounds
      var clampedX = Math.max(taRect.left + m.padLeft, Math.min(clientX, taRect.right - 4));
      var clampedY = Math.max(taRect.top + m.padTop, Math.min(clientY, taRect.bottom - m.lineH));

      // Snap to grid (line height for Y, char width for X)
      var relY = clampedY - taRect.top - m.padTop + ta.scrollTop;
      var relX = clampedX - taRect.left - m.padLeft;
      var lineIdx = Math.floor(relY / m.lineH);
      var col = Math.round(relX / m.charW);

      // Snap visual position
      var snapX = m.padLeft + col * m.charW;
      var snapY = m.padTop + lineIdx * m.lineH - ta.scrollTop;

      dropLine.style.left = (taRect.left - paneRect.left + snapX) + "px";
      dropLine.style.top = (taRect.top - paneRect.top + snapY) + "px";
      dropLine.style.height = m.lineH + "px";
      dropLine.style.display = "block";
    }

    var _dragThrottle = 0;
    textarea.addEventListener("dragover", function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      textarea.classList.add("drag-over");

      // Throttle visual updates to every 30ms for smooth tracking
      var now = Date.now();
      if (now - _dragThrottle < 30) return;
      _dragThrottle = now;

      // Show the blue indicator line snapped to the character grid
      showDropLineAtMouse(textarea, e.clientX, e.clientY);

      // Also move the textarea caret to match
      var offset = mouseToOffset(textarea, e.clientX, e.clientY);
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = offset;
    });
    textarea.addEventListener("dragleave", function(e) {
      // Only hide if actually leaving textarea (not entering a child)
      var taRect = textarea.getBoundingClientRect();
      if (e.clientX < taRect.left || e.clientX > taRect.right ||
          e.clientY < taRect.top || e.clientY > taRect.bottom) {
        textarea.classList.remove("drag-over");
        dropLine.style.display = "none";
      }
    });
    textarea.addEventListener("drop", function(e) {
      e.preventDefault();
      textarea.classList.remove("drag-over");
      dropLine.style.display = "none";

      var data;
      try {
        data = JSON.parse(e.dataTransfer.getData("text/plain"));
      } catch (err) {
        return;
      }

      if (!data || !data.id) return;

      // Insert master item reference by ID
      var typePrefix = data.type === "dimension" ? "dim" : "msr";
      var dropText = "\\$\\{\\{" + typePrefix + ":" + data.id + ":" + data.title + "\\}\\}";

      // Calculate drop position from mouse coordinates
      var pos = mouseToOffset(textarea, e.clientX, e.clientY);

      // Insert at drop position
      var before = textarea.value.substring(0, pos);
      var after = textarea.value.substring(pos);
      textarea.value = before + dropText + after;
      textarea.selectionStart = textarea.selectionEnd = pos + dropText.length;
      textarea.focus();
      updatePreview();
    });

    // --- Fetch dimensions & measures from the app ---
    function renderSidebarItems(searchFilter) {
      var listEl = sidebar.querySelector(".qix-sidebar-list");
      var filter = (searchFilter || "").toLowerCase();

      var html = "";

      // Dimensions section
      var filteredDims = dimensions.filter(function(d) {
        return !filter || d.title.toLowerCase().indexOf(filter) > -1 ||
          (d.expr && d.expr.toLowerCase().indexOf(filter) > -1);
      });
      if (filteredDims.length > 0) {
        html += '<div class="qix-sidebar-section"><div class="qix-sidebar-section-title">Dimensions (' + filteredDims.length + ')</div>';
        filteredDims.forEach(function(d) {
          html += '<div class="qix-sidebar-item" draggable="true" data-type="dimension" data-expr="' +
            d.expr.replace(/"/g, '&quot;') + '" data-title="' + d.title.replace(/"/g, '&quot;') +
            '" data-id="' + (d.id || "").replace(/"/g, '&quot;') + '">' +
            '<div class="qix-sidebar-icon dim">D</div>' +
            '<div><div class="qix-sidebar-item-label">' + d.title + '</div>' +
            '<div class="qix-sidebar-item-expr">' + d.expr + '</div></div></div>';
        });
        html += '</div>';
      }

      // Measures section
      var filteredMsrs = measures.filter(function(m) {
        return !filter || m.title.toLowerCase().indexOf(filter) > -1 ||
          (m.expr && m.expr.toLowerCase().indexOf(filter) > -1);
      });
      if (filteredMsrs.length > 0) {
        html += '<div class="qix-sidebar-section"><div class="qix-sidebar-section-title">Measures (' + filteredMsrs.length + ')</div>';
        filteredMsrs.forEach(function(m) {
          html += '<div class="qix-sidebar-item" draggable="true" data-type="measure" data-expr="' +
            m.expr.replace(/"/g, '&quot;') + '" data-title="' + m.title.replace(/"/g, '&quot;') +
            '" data-id="' + (m.id || "").replace(/"/g, '&quot;') + '">' +
            '<div class="qix-sidebar-icon msr">M</div>' +
            '<div><div class="qix-sidebar-item-label">' + m.title + '</div>' +
            '<div class="qix-sidebar-item-expr">' + m.expr + '</div></div></div>';
        });
        html += '</div>';
      }

      if (!html) {
        html = '<div class="qix-sidebar-empty">' + (filter ? "No matches" : "No master items found") + '</div>';
      }

      listEl.innerHTML = html;

      // Attach drag listeners
      listEl.querySelectorAll(".qix-sidebar-item").forEach(function(item) {
        item.addEventListener("dragstart", function(e) {
          item.classList.add("dragging");
          e.dataTransfer.effectAllowed = "copy";
          e.dataTransfer.setData("text/plain", JSON.stringify({
            type: item.getAttribute("data-type"),
            title: item.getAttribute("data-title"),
            expr: item.getAttribute("data-expr"),
            id: item.getAttribute("data-id")
          }));
        });
        item.addEventListener("dragend", function() {
          item.classList.remove("dragging");
        });
        // Also support double-click-to-insert (uses master item ref by ID)
        item.addEventListener("dblclick", function() {
          var itemType = item.getAttribute("data-type");
          var itemId = item.getAttribute("data-id");
          var itemTitle = item.getAttribute("data-title");
          var typePrefix = itemType === "dimension" ? "dim" : "msr";
          var insertText = "\\$\\{\\{" + typePrefix + ":" + itemId + ":" + itemTitle + "\\}\\}";
          var pos = textarea.selectionStart;
          textarea.value = textarea.value.substring(0, pos) + insertText + textarea.value.substring(pos);
          textarea.selectionStart = textarea.selectionEnd = pos + insertText.length;
          textarea.focus();
          updatePreview();
        });
      });
    }

    // Search filtering
    var searchInput = sidebar.querySelector(".qix-sidebar-search");
    searchInput.addEventListener("input", function() {
      renderSidebarItems(searchInput.value);
    });

    // Fetch master items from the Qlik app
    if (options.app) {
      var app = options.app;
      // Fetch dimensions
      var dimPromise = app.createSessionObject({
        qInfo: { qType: "DimensionList", qId: "" },
        qDimensionListDef: {
          qType: "dimension",
          qData: {
            title: "/qMetaDef/title",
            tags: "/qMetaDef/tags",
            grouping: "/qDim/qGrouping",
            info: "/qDimInfos",
            dim: "/qDim"
          }
        }
      }).then(function(model) {
        return model.getLayout().then(function(layout) {
          if (layout.qDimensionList && layout.qDimensionList.qItems) {
            dimensions = layout.qDimensionList.qItems.map(function(item) {
              var expr = "";
              // Prefer qFieldDefs from the dimension definition
              if (item.qData && item.qData.dim && item.qData.dim.qFieldDefs && item.qData.dim.qFieldDefs.length > 0) {
                expr = item.qData.dim.qFieldDefs[0];
              }
              // Fallback to qDimInfos
              if (!expr && item.qData && item.qData.info && item.qData.info.length > 0) {
                expr = item.qData.info[0].qName || "";
              }
              return {
                title: (item.qData && item.qData.title) || item.qMeta.title || "Untitled",
                expr: expr || "[" + ((item.qData && item.qData.title) || "field") + "]",
                id: item.qInfo.qId
              };
            });
          }
          // Clean up session object
          app.destroySessionObject(model.id).catch(function(){});
        });
      }).catch(function(err) {
        console.warn("[qixMD] Failed to load dimensions:", err);
      });

      // Fetch measures
      var msrPromise = app.createSessionObject({
        qInfo: { qType: "MeasureList", qId: "" },
        qMeasureListDef: {
          qType: "measure",
          qData: {
            title: "/qMetaDef/title",
            tags: "/qMetaDef/tags",
            measure: "/qMeasure"
          }
        }
      }).then(function(model) {
        return model.getLayout().then(function(layout) {
          if (layout.qMeasureList && layout.qMeasureList.qItems) {
            measures = layout.qMeasureList.qItems.map(function(item) {
              var expr = "";
              if (item.qData && item.qData.measure) {
                expr = item.qData.measure.qDef || "";
              }
              return {
                title: (item.qData && item.qData.title) || item.qMeta.title || "Untitled",
                expr: expr || item.qMeta.title || "",
                id: item.qInfo.qId
              };
            });
          }
          app.destroySessionObject(model.id).catch(function(){});
        });
      }).catch(function(err) {
        console.warn("[qixMD] Failed to load measures:", err);
      });

      Promise.all([dimPromise, msrPromise]).then(function() {
        renderSidebarItems("");
      });
    } else {
      sidebar.querySelector(".qix-sidebar-list").innerHTML =
        '<div class="qix-sidebar-empty">App not available in this context</div>';
    }

    // --- Close / Cancel ---
    function close() {
      document.body.removeChild(overlay);
    }

    header.querySelector(".qix-modal-close").addEventListener("click", function() {
      close();
      if (options.onCancel) options.onCancel();
    });

    footer.querySelector(".qix-btn-cancel").addEventListener("click", function() {
      close();
      if (options.onCancel) options.onCancel();
    });

    // Close on overlay click (outside modal)
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) {
        close();
        if (options.onCancel) options.onCancel();
      }
    });

    // Escape key
    function onEsc(e) {
      if (e.key === "Escape") {
        close();
        if (options.onCancel) options.onCancel();
        document.removeEventListener("keydown", onEsc);
      }
    }
    document.addEventListener("keydown", onEsc);

    // --- Save ---
    footer.querySelector(".qix-btn-save").addEventListener("click", function() {
      var val = textarea.value;
      close();
      if (options.onSave) options.onSave(val);
    });

    // Also Ctrl+S to save
    textarea.addEventListener("keydown", function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        var val = textarea.value;
        close();
        if (options.onSave) options.onSave(val);
      }
    });
  }

  // =====================================================
  //  Property Panel
  // =====================================================
  function propertyPanel() {
    return {
      definition: {
        type: "items",
        component: "accordion",
        items: {
          data: {
            uses: "data",
            items: {
              measures: {
                uses: "measures",
                min: 0,
                max: 1
              }
            }
          },
          markdownSettings: {
            type: "items",
            label: "Markdown Settings",
            items: {
              staticMarkdownEditor: {
                label: "Static Markdown Text",
                component: {
                  template: '<div class="qix-md-editor-wrap" style="padding:8px 10px;">' +
                    '<textarea class="qix-md-editor lui-textarea" style="width:100%;min-height:100px;max-height:260px;resize:vertical;font-family:monospace;font-size:12px;padding:3px 6px;border:1px solid #b3b3b3;border-radius:3px;box-sizing:border-box;line-height:1.5;color:#595959;outline:none;" ' +
                    'ng-model="mdText" ng-change="onTextChange()" ng-trim="false" placeholder="Enter markdown content here..."></textarea>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">' +
                      '<span style="font-size:12px;color:#888;font-family:Source Sans Pro,sans-serif;">{{mdText.length || 0}} characters</span>' +
                      '<button ng-click="openFullEditor()" style="height:28px;padding:0 12px;font-size:13px;font-weight:600;font-family:Source Sans Pro,sans-serif;background:transparent;color:#595959;border:1px solid #b3b3b3;border-radius:3px;cursor:pointer;line-height:26px;">Open Full Editor</button>' +
                    '</div>' +
                    '</div>',
                  controller: ["$scope", function($scope) {
                    var parent = $scope.$parent || {};
                    var args = parent.args || {};
                    var properties = args.properties;

                    function getVal() {
                      return (properties && properties.props && properties.props.staticMarkdown) || "";
                    }

                    $scope.mdText = getVal();

                    $scope.onTextChange = function() {
                      if (properties) {
                        if (!properties.props) properties.props = {};
                        properties.props.staticMarkdown = $scope.mdText;
                        if (args.saveProperties) {
                          args.saveProperties(properties);
                        }
                      }
                    };

                    $scope.openFullEditor = function() {
                      openEditorModal({
                        markdown: getVal(),
                        app: args.app || null,
                        onSave: function(newMarkdown) {
                          $scope.mdText = newMarkdown;
                          if (properties) {
                            if (!properties.props) properties.props = {};
                            properties.props.staticMarkdown = newMarkdown;
                            if (args.saveProperties) {
                              args.saveProperties(properties);
                            }
                          }
                          $scope.$apply();
                        }
                      });
                    };

                    $scope.$watch(function() {
                      return getVal();
                    }, function(nv) {
                      if (nv !== $scope.mdText) $scope.mdText = nv || "";
                    });
                  }]
                },
                type: "string",
                ref: "props.staticMarkdown",
                defaultValue: ""
              },
              sourceMode: {
                ref: "props.sourceMode",
                label: "Content Source",
                type: "string",
                component: "dropdown",
                defaultValue: "auto",
                options: [
                  { value: "auto", label: "Auto (measure first, then static)" },
                  { value: "measure", label: "Measure only" },
                  { value: "static", label: "Static text only" }
                ]
              }
            }
          },
          appearance: {
            uses: "settings",
            items: {
              presentation: {
                type: "items",
                translation: "properties.presentation",
                grouped: true,
                items: {
                  styleEditor: {
                    component: "styling-panel",
                    chartTitle: "Object.MarkdownViewer",
                    translation: "LayerStyleEditor.component.styling",
                    subtitle: "LayerStyleEditor.component.styling",
                    ref: "components",
                    useGeneral: true,
                    useBackground: true,
                    items: {}
                  }
                }
              }
            }
          },
          typography: {
            type: "items",
            label: "Typography & Colors",
            items: {
              useTheme: {
                ref: "props.useTheme",
                label: "Use Qlik Theme Colors",
                type: "boolean",
                defaultValue: true,
                component: "switch",
                options: [
                  { value: true, label: "On" },
                  { value: false, label: "Off" }
                ]
              },
              fontSize: {
                ref: "props.fontSize",
                label: "Base Font Size (px)",
                type: "number",
                defaultValue: 14,
                expression: "optional"
              },
              fontFamily: {
                ref: "props.fontFamily",
                label: "Font Family",
                type: "string",
                defaultValue: "",
                expression: "optional"
              },
              textColor: {
                ref: "props.textColor",
                label: "Text Color",
                type: "string",
                defaultValue: "#333333",
                expression: "optional",
                show: function(d) { return !(d.props && d.props.useTheme); }
              },
              linkColor: {
                ref: "props.linkColor",
                label: "Link Color",
                type: "string",
                defaultValue: "#0073e6",
                expression: "optional",
                show: function(d) { return !(d.props && d.props.useTheme); }
              },
              padding: {
                ref: "props.padding",
                label: "Padding (px)",
                type: "number",
                defaultValue: 16,
                expression: "optional"
              }
            }
          }
        }
      },
      support: {
        snapshot: true,
        export: true,
        exportData: false,
        sharing: true
      }
    };
  }

  // =====================================================
  //  Expression Evaluation Engine
  // =====================================================
  var _exprSessionModel = null;
  var _exprKey = "";
  var _exprCache = {}; // cache key -> evaluated value
  var _appRef = null;
  var _masterItemCache = {}; // master item ID -> { type, expr, title }
  var _masterItemsLoaded = false;

  // Load master item definitions (dimensions + measures) so we can resolve IDs to expressions
  function loadMasterItems(app, callback) {
    if (!app) return callback({});
    if (_masterItemsLoaded && Object.keys(_masterItemCache).length > 0) return callback(_masterItemCache);

    var dimPromise = app.createSessionObject({
      qInfo: { qType: "DimensionList", qId: "" },
      qDimensionListDef: {
        qType: "dimension",
        qData: { title: "/qMetaDef/title", dim: "/qDim" }
      }
    }).then(function(model) {
      return model.getLayout().then(function(layout) {
        if (layout.qDimensionList && layout.qDimensionList.qItems) {
          layout.qDimensionList.qItems.forEach(function(item) {
            var expr = "";
            if (item.qData && item.qData.dim && item.qData.dim.qFieldDefs && item.qData.dim.qFieldDefs.length > 0) {
              expr = item.qData.dim.qFieldDefs[0];
            }
            _masterItemCache[item.qInfo.qId] = {
              type: "dim",
              expr: expr || "[" + ((item.qData && item.qData.title) || "field") + "]",
              title: (item.qData && item.qData.title) || "Untitled"
            };
          });
        }
        app.destroySessionObject(model.id).catch(function(){});
      });
    }).catch(function(err) { console.warn("[qixMD] Failed to load dim master items:", err); });

    var msrPromise = app.createSessionObject({
      qInfo: { qType: "MeasureList", qId: "" },
      qMeasureListDef: {
        qType: "measure",
        qData: { title: "/qMetaDef/title", measure: "/qMeasure" }
      }
    }).then(function(model) {
      return model.getLayout().then(function(layout) {
        if (layout.qMeasureList && layout.qMeasureList.qItems) {
          layout.qMeasureList.qItems.forEach(function(item) {
            var expr = "";
            if (item.qData && item.qData.measure) {
              expr = item.qData.measure.qDef || "";
            }
            _masterItemCache[item.qInfo.qId] = {
              type: "msr",
              expr: expr || item.qMeta.title || "",
              title: (item.qData && item.qData.title) || "Untitled"
            };
          });
        }
        app.destroySessionObject(model.id).catch(function(){});
      });
    }).catch(function(err) { console.warn("[qixMD] Failed to load msr master items:", err); });

    Promise.all([dimPromise, msrPromise]).then(function() {
      _masterItemsLoaded = true;
      callback(_masterItemCache);
    });
  }

  // Resolve master item references to actual expressions
  // Converts master item ref placeholders (dim/msr colon ID colon Title) into expression placeholders
  function resolveMasterItemRefs(text, miCache) {
    return text.replace(/\\$\\{\\{(dim|msr):([^:]+):[\\s\\S]+?\\}\\}/g, function(match, type, id) {
      var mi = miCache[id];
      if (mi && mi.expr) {
        return "\\$\\{\\{=" + mi.expr + "\\}\\}";
      }
      // Master item not found — show placeholder
      return "\\u26A0\\uFE0F [missing master item]";
    });
  }

  // Extract all direct expression placeholders from text (double-brace syntax)
  function extractExpressions(text) {
    var regex = /\\$\\{\\{=([\\s\\S]+?)\\}\\}/g;
    var exprs = [];
    var match;
    while ((match = regex.exec(text)) !== null) {
      if (exprs.indexOf(match[1]) === -1) exprs.push(match[1]);
    }
    return exprs;
  }

  // Check if text contains master item references
  function hasMasterItemRefs(text) {
    return /\\$\\{\\{(dim|msr):/.test(text);
  }

  // Evaluate expressions via Qlik Engine session object
  function evaluateExpressions(app, expressions, callback) {
    if (!app || expressions.length === 0) return;

    var key = expressions.join("\\x01");

    // If expressions changed, recreate session object
    if (key !== _exprKey) {
      _exprKey = key;
      // Destroy old session object
      if (_exprSessionModel) {
        try { app.destroySessionObject(_exprSessionModel.id).catch(function(){}); } catch(e) {}
        _exprSessionModel = null;
      }

      // Build a generic object with qStringExpression for each expr
      var objDef = { qInfo: { qType: "qixMdExprEval" } };
      expressions.forEach(function(expr, i) {
        objDef["expr" + i] = { qStringExpression: "=" + expr };
      });

      app.createSessionObject(objDef).then(function(model) {
        _exprSessionModel = model;
        return model.getLayout();
      }).then(function(layout) {
        expressions.forEach(function(expr, i) {
          _exprCache[expr] = layout["expr" + i];
        });
        callback(_exprCache);

        // Subscribe to layout changes (selection-reactive)
        if (_exprSessionModel) {
          _exprSessionModel.on("changed", function() {
            _exprSessionModel.getLayout().then(function(lay) {
              expressions.forEach(function(expr, i) {
                _exprCache[expr] = lay["expr" + i];
              });
              callback(_exprCache);
            }).catch(function(){});
          });
        }
      }).catch(function(err) {
        console.warn("[qixMD] Expression evaluation failed:", err);
      });
    } else if (_exprSessionModel) {
      // Same expressions, just get fresh layout
      _exprSessionModel.getLayout().then(function(layout) {
        expressions.forEach(function(expr, i) {
          _exprCache[expr] = layout["expr" + i];
        });
        callback(_exprCache);
      }).catch(function(){});
    } else {
      // Cache available from previous eval
      if (Object.keys(_exprCache).length > 0) {
        callback(_exprCache);
      }
    }
  }

  // Replace expression placeholders with values from cache
  function resolveExpressions(text, cache) {
    return text.replace(/\\$\\{\\{=([\\s\\S]+?)\\}\\}/g, function(match, expr) {
      if (cache && cache[expr] !== undefined && cache[expr] !== null) {
        return cache[expr];
      }
      // Show loading indicator for unresolved expressions
      return "\\u2026"; // ellipsis
    });
  }

  // =====================================================
  //  Render helper — builds the full HTML for the viewer
  // =====================================================
  function buildViewerHTML(markdownText, props, theme) {
    var useThemeColors = props.useTheme !== false;
    var fontSize = props.fontSize || 14;
    var fontFamily = props.fontFamily || "inherit";
    var padding = (props.padding !== undefined && props.padding !== null) ? props.padding : 16;
    var textColor, linkColor, headingColor, mutedColor, borderColor, codeBg, codeColor, blockquoteBg, stripeBg, accentColor;

    if (useThemeColors && theme) {
      var themeColor = "#333333";
      var themeFontFamily = "inherit";
      var themePrimaryColor = "#3AB533";

      try { themeColor = theme.getStyle("", "", "color") || themeColor; } catch(e) {}
      try { themeFontFamily = theme.getStyle("", "", "fontFamily") || themeFontFamily; } catch(e) {}

      var titleColor = themeColor;
      try { titleColor = theme.getStyle("object.title.main", "", "color") || titleColor; } catch(e) {}

      var subtitleColor = "";
      try { subtitleColor = theme.getStyle("object.title.subTitle", "", "color") || ""; } catch(e) {}

      try { themePrimaryColor = theme.getDataColorSpecials().primary || themePrimaryColor; } catch(e) {}

      if (!props.fontFamily) fontFamily = themeFontFamily;

      textColor = themeColor;
      headingColor = titleColor;
      mutedColor = subtitleColor || "rgba(0,0,0,0.45)";
      linkColor = themePrimaryColor;
      accentColor = themePrimaryColor;

      var r = parseInt(textColor.replace("#","").substring(0,2), 16) || 0;
      var g = parseInt(textColor.replace("#","").substring(2,4), 16) || 0;
      var b = parseInt(textColor.replace("#","").substring(4,6), 16) || 0;
      var isDarkText = (r * 0.299 + g * 0.587 + b * 0.114) < 128;

      if (isDarkText) {
        codeBg = "rgba(" + r + "," + g + "," + b + ",0.04)";
        codeColor = "inherit";
        borderColor = "rgba(" + r + "," + g + "," + b + ",0.12)";
        stripeBg = "rgba(" + r + "," + g + "," + b + ",0.02)";
        blockquoteBg = "rgba(" + r + "," + g + "," + b + ",0.03)";
      } else {
        codeBg = "rgba(255,255,255,0.08)";
        codeColor = "inherit";
        borderColor = "rgba(255,255,255,0.15)";
        stripeBg = "rgba(255,255,255,0.04)";
        blockquoteBg = "rgba(255,255,255,0.06)";
      }
    } else {
      textColor = props.textColor || "#333333";
      linkColor = props.linkColor || "#0073e6";
      headingColor = "inherit";
      mutedColor = "#666";
      accentColor = linkColor;
      codeBg = "#f4f4f8";
      codeColor = "inherit";
      borderColor = "#e0e0e0";
      stripeBg = "rgba(0,0,0,0.02)";
      blockquoteBg = "rgba(0,115,230,0.05)";
    }

    var rawHtml = marked.parse(markdownText || "");
    var cleanHtml = DOMPurify.sanitize(rawHtml, purifyConfig);

    var style = [
      "font-size:" + fontSize + "px",
      "font-family:" + fontFamily,
      "color:" + textColor,
      "padding:" + padding + "px",
      "--md-text-color:" + textColor,
      "--md-heading-color:" + headingColor,
      "--md-muted-color:" + mutedColor,
      "--md-link-color:" + linkColor,
      "--md-accent-color:" + accentColor,
      "--md-border-color:" + borderColor,
      "--md-code-bg:" + codeBg,
      "--md-code-color:" + codeColor,
      "--md-blockquote-bg:" + blockquoteBg,
      "--md-stripe-bg:" + stripeBg
    ].join(";");

    return '<div class="qix-markdown-viewer" style="' + style + '">' + cleanHtml + "</div>";
  }

  function applyLinksTarget(element) {
    var links = element.querySelectorAll(".qix-markdown-viewer a");
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute("target", "_blank");
      links[i].setAttribute("rel", "noopener noreferrer");
    }
  }

  // =====================================================
  //  Copy content — native context menu action
  // =====================================================

  // Remember what is currently shown so the context menu can copy all of it,
  // not just the part visible in the scroll area
  function renderViewer(element, markdownText, props, theme) {
    element.innerHTML = buildViewerHTML(markdownText, props, theme);
    applyLinksTarget(element);
    element.__qixMdContent = markdownText || "";
  }

  // Fallback for browsers without the async clipboard API (or when it is denied)
  function copyWithSelection(html, text) {
    var holder = document.createElement("div");
    holder.setAttribute("contenteditable", "true");
    holder.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;white-space:pre-wrap;";
    holder.innerHTML = html;
    document.body.appendChild(holder);
    var onCopy = function(e) {
      if (!e.clipboardData) return;
      e.clipboardData.setData("text/html", html);
      e.clipboardData.setData("text/plain", text);
      e.preventDefault();
    };
    document.addEventListener("copy", onCopy);
    var ok = false;
    try {
      var range = document.createRange();
      range.selectNodeContents(holder);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      ok = document.execCommand("copy");
      sel.removeAllRanges();
    } catch (e) {
      ok = false;
    }
    document.removeEventListener("copy", onCopy);
    document.body.removeChild(holder);
    return ok;
  }

  // Copies the full content: rendered HTML (keeps formatting when pasted into
  // Word, Outlook, Teams, ...) plus the resolved markdown as plain text
  function copyContent(element) {
    var text = element.__qixMdContent || "";
    var viewer = element.querySelector(".qix-markdown-viewer");
    var html = viewer ? viewer.innerHTML : "";
    if (!text && !html) return Promise.resolve(false);

    if (navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== "undefined") {
      return navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" })
      })]).then(function() { return true; }, function() {
        return copyWithSelection(html, text);
      });
    }
    return Promise.resolve(copyWithSelection(html, text));
  }

  // Small, unobtrusive confirmation in the corner of the object
  function showCopyToast(element, ok) {
    var old = element.querySelector(".qix-md-copy-toast");
    if (old) old.parentNode.removeChild(old);
    var toast = document.createElement("div");
    toast.className = "qix-md-copy-toast";
    toast.textContent = ok ? "Content copied" : "Copy failed";
    if (window.getComputedStyle(element).position === "static") element.style.position = "relative";
    element.appendChild(toast);
    setTimeout(function() { toast.style.opacity = "0"; }, 1200);
    setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 1600);
  }

  // =====================================================
  //  Supernova factory — Viewer Component
  // =====================================================
  return function (env) {
    // Store app reference for expression evaluation
    _appRef = (env && env.app) || null;

    return {
      qae: {
        properties: {
          props: {
            staticMarkdown: "",
            sourceMode: "auto",
            useTheme: true,
            fontSize: 14,
            fontFamily: "",
            textColor: "#333333",
            linkColor: "#0073e6",
            padding: 16
          },
          qHyperCubeDef: {
            qDimensions: [],
            qMeasures: [],
            qInitialDataFetch: [{ qWidth: 1, qHeight: 1 }]
          }
        },
        data: {
          targets: [{
            path: "/qHyperCubeDef",
            dimensions: { min: 0, max: 0 },
            measures: { min: 0, max: 1 }
          }]
        }
      },
      ext: propertyPanel(),
      component: function () {
        var element = stardust.useElement();
        var layout = stardust.useLayout();
        var theme = stardust.useTheme();
        // Try to get app from stardust hook or from stored ref
        var app = (stardust.useApp ? stardust.useApp() : null) || _appRef;

        // Add "Copy content" to the native right-click menu of the object
        if (stardust.onContextMenu) {
          stardust.onContextMenu(function(menu) {
            if (!menu || typeof menu.addItem !== "function") return;
            menu.addItem({
              translation: "Copy content",
              tid: "qixmd-copy-content",
              icon: "lui-icon lui-icon--copy",
              select: function() {
                copyContent(element).then(function(ok) { showCopyToast(element, ok); });
              }
            });
          });
        }

        try {
          injectCSS();

          var props = layout.props || {};
          var sourceMode = props.sourceMode || "auto";
          var markdownText = "";

          // Resolve content source
          var measureText = "";
          try {
            var qHC = layout.qHyperCube;
            var matrix = qHC && qHC.qDataPages && qHC.qDataPages[0] && qHC.qDataPages[0].qMatrix;
            if (matrix && matrix[0] && matrix[0][0]) {
              measureText = matrix[0][0].qText || "";
            }
          } catch (err) {
            measureText = "";
          }

          if (sourceMode === "measure") {
            markdownText = measureText;
          } else if (sourceMode === "static") {
            markdownText = props.staticMarkdown || "";
          } else {
            markdownText = measureText || props.staticMarkdown || "";
          }

          // Check for master item references and expression placeholders
          var needsMasterItems = hasMasterItemRefs(markdownText);
          var directExprs = extractExpressions(markdownText);

          if ((needsMasterItems || directExprs.length > 0) && app) {
            // Show loading state with cached values or ellipsis
            var quickResolved = markdownText;
            if (needsMasterItems && _masterItemsLoaded) {
              quickResolved = resolveMasterItemRefs(quickResolved, _masterItemCache);
            }
            var quickExprs = extractExpressions(quickResolved);
            if (quickExprs.length > 0) {
              quickResolved = resolveExpressions(quickResolved, _exprCache);
            }
            renderViewer(element, quickResolved, props, theme);

            // Load master items (cached after first load), then evaluate
            loadMasterItems(app, function(miCache) {
              var resolved = markdownText;
              if (needsMasterItems) {
                resolved = resolveMasterItemRefs(resolved, miCache);
              }
              var expressions = extractExpressions(resolved);
              if (expressions.length > 0) {
                evaluateExpressions(app, expressions, function(cache) {
                  var final = resolveExpressions(resolved, cache);
                  renderViewer(element, final, props, theme);
                });
              } else {
                renderViewer(element, resolved, props, theme);
              }
            });
          } else {
            // No expressions — render directly
            renderViewer(element, markdownText, props, theme);
          }
        } catch(renderErr) {
          console.error("[qixMD] RENDER ERROR:", renderErr.message, renderErr.stack);
          element.innerHTML = '<div style="color:red;padding:10px;">Render error: ' + renderErr.message + '</div>';
        }
      }
    };
  };
});
`;

fs.writeFileSync(path.join(__dirname, '../dist/qixMarkdownViewer.js'), supernovaCode);
console.log('Built dist/qixMarkdownViewer.js (' + Math.round(supernovaCode.length / 1024) + 'kb)');
