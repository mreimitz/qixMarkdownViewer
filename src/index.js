import { useElement, useLayout, useEffect, useTheme } from '@nebula.js/stardust';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked
marked.setOptions({ gfm: true, breaks: true });

// DOMPurify config
var purifyConfig = {
  ALLOWED_TAGS: [
    'h1','h2','h3','h4','h5','h6',
    'p','br','hr',
    'ul','ol','li',
    'blockquote','pre','code',
    'table','thead','tbody','tr','th','td',
    'strong','em','del','s','a','img',
    'span','div','sub','sup',
    'input'
  ],
  ALLOWED_ATTR: [
    'href','target','rel','src','alt','title',
    'class','id',
    'checked','disabled','type',
    'align','colspan','rowspan'
  ],
  ALLOW_DATA_ATTR: false
};

var CSS = `
.qix-markdown-viewer {
  width:100%;height:100%;overflow-y:auto;overflow-x:hidden;
  box-sizing:border-box;line-height:1.6;word-wrap:break-word;overflow-wrap:break-word;
}
.qix-markdown-viewer h1,.qix-markdown-viewer h2,.qix-markdown-viewer h3,
.qix-markdown-viewer h4,.qix-markdown-viewer h5,.qix-markdown-viewer h6 {
  margin-top:1em;margin-bottom:0.5em;font-weight:600;line-height:1.3;
}
.qix-markdown-viewer h1 { font-size:2em;border-bottom:1px solid #e0e0e0;padding-bottom:0.3em; }
.qix-markdown-viewer h2 { font-size:1.5em;border-bottom:1px solid #e0e0e0;padding-bottom:0.25em; }
.qix-markdown-viewer h3 { font-size:1.25em; }
.qix-markdown-viewer h4 { font-size:1.1em; }
.qix-markdown-viewer h5 { font-size:1em; }
.qix-markdown-viewer h6 { font-size:0.9em;color:#666; }
.qix-markdown-viewer h1:first-child,.qix-markdown-viewer h2:first-child,
.qix-markdown-viewer h3:first-child { margin-top:0; }
.qix-markdown-viewer p { margin:0 0 1em 0; }
.qix-markdown-viewer a { color:var(--md-link-color,#0073e6);text-decoration:none; }
.qix-markdown-viewer a:hover { text-decoration:underline; }
.qix-markdown-viewer ul,.qix-markdown-viewer ol { margin:0 0 1em 0;padding-left:2em; }
.qix-markdown-viewer li { margin-bottom:0.25em; }
.qix-markdown-viewer li>ul,.qix-markdown-viewer li>ol { margin-top:0.25em;margin-bottom:0; }
.qix-markdown-viewer li input[type="checkbox"] { margin-right:0.4em;vertical-align:middle; }
.qix-markdown-viewer blockquote {
  margin:0 0 1em 0;padding:0.5em 1em;
  border-left:4px solid #0073e6;background:rgba(0,115,230,0.05);
}
.qix-markdown-viewer blockquote p:last-child { margin-bottom:0; }
.qix-markdown-viewer code {
  font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;
  font-size:0.875em;background:#f4f4f8;padding:0.15em 0.4em;border-radius:3px;
}
.qix-markdown-viewer pre {
  margin:0 0 1em 0;padding:1em;background:#f4f4f8;border-radius:6px;overflow-x:auto;line-height:1.45;
}
.qix-markdown-viewer pre code { background:none;padding:0;font-size:0.85em; }
.qix-markdown-viewer table { border-collapse:collapse;width:100%;margin:0 0 1em 0;font-size:0.95em; }
.qix-markdown-viewer th,.qix-markdown-viewer td { border:1px solid #ddd;padding:0.5em 0.75em;text-align:left; }
.qix-markdown-viewer th { background:#f4f4f8;font-weight:600; }
.qix-markdown-viewer tr:nth-child(even) { background:rgba(0,0,0,0.02); }
.qix-markdown-viewer hr { border:none;border-top:1px solid #e0e0e0;margin:1.5em 0; }
.qix-markdown-viewer img { max-width:100%;height:auto;border-radius:4px; }
.qix-markdown-viewer strong { font-weight:700; }
.qix-markdown-viewer em { font-style:italic; }
.qix-markdown-viewer del,.qix-markdown-viewer s { text-decoration:line-through;opacity:0.7; }
.qix-markdown-viewer::-webkit-scrollbar { width:6px; }
.qix-markdown-viewer::-webkit-scrollbar-track { background:transparent; }
.qix-markdown-viewer::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.15);border-radius:3px; }
.qix-markdown-viewer::-webkit-scrollbar-thumb:hover { background:rgba(0,0,0,0.3); }
`;

// Inject CSS once
var cssInjected = false;
function injectCSS() {
  if (cssInjected) return;
  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

function propertyPanel() {
  return {
    definition: {
      type: 'items',
      component: 'accordion',
      items: {
        data: {
          uses: 'data',
          items: {
            measures: {
              uses: 'measures',
              min: 0,
              max: 1
            }
          }
        },
        markdownSettings: {
          type: 'items',
          label: 'Markdown Settings',
          items: {
            staticMarkdown: {
              ref: 'props.staticMarkdown',
              label: 'Static Markdown Text',
              type: 'string',
              defaultValue: '',
              component: 'textarea',
              rows: 10
            },
            sourceMode: {
              ref: 'props.sourceMode',
              label: 'Content Source',
              type: 'string',
              component: 'dropdown',
              defaultValue: 'auto',
              options: [
                { value: 'auto', label: 'Auto (measure first, then static)' },
                { value: 'measure', label: 'Measure only' },
                { value: 'static', label: 'Static text only' }
              ]
            }
          }
        },
        appearance: {
          uses: 'settings'
        },
        typography: {
          type: 'items',
          label: 'Typography',
          items: {
            fontSize: {
              ref: 'props.fontSize',
              label: 'Base Font Size (px)',
              type: 'number',
              defaultValue: 14,
              expression: 'optional'
            },
            fontFamily: {
              ref: 'props.fontFamily',
              label: 'Font Family',
              type: 'string',
              defaultValue: '',
              expression: 'optional'
            },
            textColor: {
              ref: 'props.textColor',
              label: 'Text Color',
              type: 'string',
              defaultValue: '#333333',
              expression: 'optional'
            },
            linkColor: {
              ref: 'props.linkColor',
              label: 'Link Color',
              type: 'string',
              defaultValue: '#0073e6',
              expression: 'optional'
            },
            padding: {
              ref: 'props.padding',
              label: 'Padding (px)',
              type: 'number',
              defaultValue: 16,
              expression: 'optional'
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

export default function supernova(env) {
  return {
    qae: {
      properties: {
        props: {
          staticMarkdown: '',
          sourceMode: 'auto',
          fontSize: 14,
          fontFamily: '',
          textColor: '#333333',
          linkColor: '#0073e6',
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
          path: '/qHyperCubeDef',
          dimensions: { min: 0, max: 0 },
          measures: { min: 0, max: 1 }
        }]
      }
    },
    ext: propertyPanel(),
    component() {
      var element = useElement();
      var layout = useLayout();

      useEffect(function () {
        injectCSS();

        var props = layout.props || {};
        var sourceMode = props.sourceMode || 'auto';
        var markdownText = '';

        // Resolve content source
        var measureText = '';
        try {
          var matrix = layout.qHyperCube &&
                       layout.qHyperCube.qDataPages &&
                       layout.qHyperCube.qDataPages[0] &&
                       layout.qHyperCube.qDataPages[0].qMatrix;
          if (matrix && matrix[0] && matrix[0][0]) {
            measureText = matrix[0][0].qText || '';
          }
        } catch (e) {
          measureText = '';
        }

        if (sourceMode === 'measure') {
          markdownText = measureText;
        } else if (sourceMode === 'static') {
          markdownText = props.staticMarkdown || '';
        } else {
          markdownText = measureText || props.staticMarkdown || '';
        }

        // Parse and sanitize
        var rawHtml = marked.parse(markdownText || '');
        var cleanHtml = DOMPurify.sanitize(rawHtml, purifyConfig);

        // Build styles
        var fontSize = props.fontSize || 14;
        var fontFamily = props.fontFamily || 'inherit';
        var textColor = props.textColor || '#333333';
        var linkColor = props.linkColor || '#0073e6';
        var padding = (props.padding !== undefined && props.padding !== null) ? props.padding : 16;

        var containerStyle = [
          'font-size:' + fontSize + 'px',
          'font-family:' + fontFamily,
          'color:' + textColor,
          'padding:' + padding + 'px',
          '--md-link-color:' + linkColor
        ].join(';');

        element.innerHTML = '<div class="qix-markdown-viewer" style="' + containerStyle + '">' +
                              cleanHtml +
                            '</div>';

        // Open links in new tab
        var links = element.querySelectorAll('.qix-markdown-viewer a');
        for (var i = 0; i < links.length; i++) {
          links[i].setAttribute('target', '_blank');
          links[i].setAttribute('rel', 'noopener noreferrer');
        }
      }, [layout]);
    }
  };
}
