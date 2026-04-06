# qixMarkdownViewer

A Qlik Cloud extension that renders markdown-formatted text with full support for dynamic expressions, master item references, and theme-aware styling.

## Installation

1. Download or build the extension ZIP containing `qixMarkdownViewer.qext`, `qixMarkdownViewer.js`, `qixMarkdownViewer.html`, `qixMarkdownViewer.css`, and the `dist/` folder.
2. In your Qlik Cloud tenant, navigate to the Management Console and upload the extension under **Extensions**.
3. Open any app in edit mode. The **Markdown Viewer** appears under **Custom objects > Extensions** in the assets panel.
4. Drag it onto a sheet to create a new instance.

## Content Sources

The extension supports three ways to supply markdown content, configured via the **Content Source** dropdown in the property panel:

| Mode | Behavior |
|------|----------|
| **Auto** (default) | Uses the measure value if a measure is assigned; otherwise falls back to the static text editor. |
| **Measure only** | Renders only the measure value. Ignores static text. |
| **Static text only** | Renders only the static text from the property panel editor. Ignores any assigned measure. |

When using a measure, assign it in the **Data** section of the property panel. The measure expression should return a string containing valid markdown.

## Markdown Syntax

The extension uses the **marked.js** parser with GitHub Flavored Markdown (GFM) enabled. All standard markdown syntax is supported:

### Text Formatting

```
**Bold text**
*Italic text*
~~Strikethrough~~
`Inline code`
```

### Headings

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Lists

```
- Bullet item
- Another item
  - Nested item

1. Numbered item
2. Another item

- [ ] Task item (unchecked)
- [x] Task item (checked)
```

### Links and Images

```
[Link text](https://example.com)
![Alt text](image-url)
```

### Blockquotes

```
> This is a blockquote.
> It can span multiple lines.
```

### Code Blocks

````
```
var x = 42;
console.log(x);
```
````

### Tables

```
| Column A | Column B | Column C |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
```

### Horizontal Rules

```
---
```

## Expression Syntax

The extension can evaluate Qlik expressions inline within your markdown text. Expressions are wrapped in a **double-brace** syntax to avoid conflicts with Qlik's set analysis curly braces.

### Direct Expressions

Use `${{=expression}}` to embed any Qlik expression. The engine evaluates it at render time and replaces the placeholder with the result.

```
Total Revenue: **${{=Sum(Revenue)}}**

Current Year: ${{=Year(Today())}}

Win Rate: ${{=Num(Sum(Won)/Sum(Total), '0.0%')}}
```

Expressions are **selection-reactive** — when the user makes selections in the app, all expression values update automatically.

### Formatting Functions

Since the expression result is inserted as plain text, use Qlik formatting functions to control the output:

```
${{=Num(Sum(Sales), '#,##0')}}         → 1,234,567
${{=Money(Sum(Sales), '$ #,##0.00')}}  → $ 1,234,567.89
${{=Date(Today(), 'MMMM D, YYYY')}}   → April 6, 2026
```

### Set Analysis in Expressions

The double-brace `${{ }}` wrapper avoids the ambiguity that single braces would cause with set analysis:

```
Won Revenue: **${{=Sum({<Status={'WON'}>} Revenue)}}**
Pipeline: **${{=Sum({<Status={'OPEN'}, IsNMDeal={1}>} WeightedValue)}}**
```

### Variables

Reference Qlik variables directly inside expressions:

```
Report generated: ${{=$(vReportDate)}}
Target: ${{=$(vAnnualTarget)}}
```

## Master Item References

When you drag a dimension or measure from the sidebar in the full editor, the extension inserts a **master item reference** instead of the raw expression. This means that if the master item's definition changes in the future, the markdown viewer automatically picks up the updated expression.

### Syntax

```
${{dim:ITEM_ID:Display Title}}    — references a master dimension
${{msr:ITEM_ID:Display Title}}    — references a master measure
```

- `dim` or `msr` identifies the item type.
- `ITEM_ID` is the internal Qlik ID of the master item (assigned automatically when dragging from the sidebar).
- `Display Title` is the human-readable name shown in the editor.

### How It Works

1. At render time, the extension fetches the current master item definitions from the Qlik engine.
2. Each `${{dim:...}}` or `${{msr:...}}` reference is resolved to its current expression.
3. The resolved expression is then evaluated and replaced with the result.

This two-step resolution ensures that renaming a field or changing a measure formula in the master items propagates automatically to every markdown viewer that references it.

### Example

If you have a master measure called "Revenue YTD" with the expression `Sum({<CalendarYear={$(vCurrentYear)}>} Revenue)`, dragging it from the sidebar produces:

```
${{msr:abc123-def456:Revenue YTD}}
```

At render time this resolves to:

```
${{=Sum({<CalendarYear={$(vCurrentYear)}>} Revenue)}}
```

which is then evaluated by the engine and the final number is displayed.

### Backward Compatibility

The legacy direct expression syntax `${{=expression}}` continues to work alongside master item references. You can mix both in the same document.

### Missing Master Items

If a referenced master item has been deleted, the viewer displays a warning icon: ⚠️ [missing master item].

## Dynamic Images

Images in markdown use the standard syntax `![alt text](url)`. The extension provides two ways to insert images — from the app's media library or via dynamic expressions — and they can be combined.

### Media Library

Click the **Image** button (📷) in the full editor toolbar to open the media library modal. This shows all images uploaded to the current app's content library. Select a thumbnail and click **Insert** (or double-click) to insert the markdown image tag with the correct URL.

The inserted syntax looks like:

```
![Logo.png](/api/v1/apps/APP_ID/media/files/Logo.png)
```

### Dynamic Image URLs from Expressions

Combine the markdown image syntax with the expression syntax to load images dynamically based on selections or variables:

**From a variable:**

```
![Company Logo](${{=vLogoURL}})
```

Define a Qlik variable `vLogoURL` containing the full URL (e.g., `https://cdn.example.com/logo.png`), and the image source updates whenever the variable changes.

**From a field value:**

```
![Product Image](${{=Only(ProductImageURL)}})
```

If your data model includes a field with image URLs, use an aggregation function like `Only()`, `MinString()`, or `MaxString()` to extract a single value.

**Conditional logic:**

```
![Region Logo](${{=If(GetSelectedCount(Region)=1, 'https://cdn.example.com/regions/' & Only(Region) & '.png', '/api/v1/apps/APP_ID/media/files/default-logo.png')}})
```

This shows a region-specific logo when exactly one region is selected, otherwise falls back to a default image from the app's media library.

**From a master dimension:**

```
![Chart](${{dim:ITEM_ID:Image URL Dimension}})
```

If you have a master dimension that resolves to a URL, reference it the same way as any other master item.

### Mixing Static and Dynamic Images

You can freely combine media library images and expression-driven images in the same document:

```
## Monthly Report

![Company Header](/api/v1/apps/APP_ID/media/files/header-banner.png)

### Regional Performance

Current region: **${{=Only(Region)}}**

![Region Map](${{=vRegionMapURL}})

### Key Metrics

| Metric | Value |
|--------|-------|
| Revenue | **${{=Money(Sum(Revenue), '$ #,##0')}}** |
| Target | **${{=Money($(vTarget), '$ #,##0')}}** |
```

### Supported Image Formats

The extension renders any image format supported by the browser (PNG, JPG, GIF, SVG, WebP). Images are displayed with `max-width: 100%` and maintain their aspect ratio.

## Full Editor

Click **Open Full Editor** in the property panel to launch the WYSIWYG modal editor. It provides:

- **Toolbar** with buttons for bold, italic, strikethrough, headings (H1–H3), links, images, bullet lists, numbered lists, task lists, inline code, code blocks, blockquotes, tables, and horizontal rules.
- **Dimensions & Measures sidebar** listing all master items from the app. Drag an item into the textarea or double-click it to insert a master item reference at the cursor position.
- **Live preview** pane that renders the markdown in real time, including evaluated expression tags shown as colored badges (blue for dimensions, green for measures).
- **Media library** accessible via the Image toolbar button, displaying all images in the app's content library.
- **Keyboard shortcuts**: Ctrl+B (bold), Ctrl+I (italic), Ctrl+K (link), Ctrl+S (save), Tab (indent), Escape (close).

### Drag and Drop

When dragging a master item from the sidebar over the textarea, a blue cursor indicator shows the exact character position where the item will be dropped. The indicator snaps to the character grid for precise placement.

## Typography and Colors

Configure visual appearance in the **Typography & Colors** section of the property panel:

| Property | Default | Description |
|----------|---------|-------------|
| Use Qlik Theme Colors | On | When enabled, the viewer inherits colors and fonts from the active Qlik theme. |
| Base Font Size (px) | 14 | Base font size for body text. Headings scale relative to this value. |
| Font Family | (theme) | Override the font family. Leave empty to use the theme font. |
| Text Color | #333333 | Body text color (only visible when theme colors are off). |
| Link Color | #0073e6 | Color for hyperlinks (only visible when theme colors are off). |
| Padding (px) | 16 | Internal padding around the rendered content. |

All typography properties accept Qlik expressions via the `fx` button, allowing dynamic styling.

## Theme Awareness

When **Use Qlik Theme Colors** is enabled, the viewer reads colors and fonts from the active Qlik theme:

- Body text color from the theme's base color
- Heading color from the theme's object title color
- Link and accent color from the theme's primary data color
- Font family from the theme's base font
- Code blocks, blockquotes, table stripes, and borders automatically adapt to light or dark themes

This ensures the markdown viewer matches the look of the rest of the app without manual configuration.

## Technical Details

- **Platform**: Qlik Cloud (supernova extension architecture)
- **Libraries**: marked.js (markdown parser), DOMPurify (HTML sanitizer)
- **Module format**: UMD wrapper compatible with Qlik's AMD loader
- **Sanitization**: All rendered HTML is sanitized through DOMPurify with an explicit allowlist of tags and attributes. Script tags, event handlers, and other potentially dangerous content are stripped.
- **Expression evaluation**: Uses Qlik Engine session objects with `qStringExpression` for server-side evaluation. A `changed` event subscription ensures values update reactively on selection changes.
- **Master item resolution**: Fetched once per session via `DimensionList` and `MeasureList` session objects, then cached for performance.

## License

MIT — Manuel Reimitz
