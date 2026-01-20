# pdfmake-template-editor

A powerful, drag-and-drop PDF template editor for React that generates `pdfmake` JSON definitions. Build complex document layouts visually and export them as high-quality PDFs instantly.

## ✨ Features

- **Drag & Drop Interface**: Built with `@dnd-kit` for a smooth, intuitive layout experience.
  - Smart collision detection for precise drop positioning
  - Drop above/below existing elements
  - Move elements between containers (columns, tables, root)
- **Rich Component Library**:
  - Headings & Paragraphs
  - Images (with resizing and borders)
  - Tables (with dynamic row/column management)
  - Dividers (custom styles and colors)
  - **Columns** (multi-column layouts with full customization)
  - Specialized Business Modules (Client Info, Business Info, Signature Blocks)
- **Advanced Column Properties**:
  - Configurable number of columns (1-6)
  - Equal width toggle with automatic distribution
  - Individual column width control (percentage or fixed)
  - Column gap spacing
  - Border settings (width, color, style, radius)
  - Background color
  - Vertical alignment (top, middle, bottom)
  - Content alignment
  - Individual column borders option
  - Margin and padding controls
- **Advanced Branding**:
  - Customizable headings (text, font size, weight, color).
  - Branding borders for business modules.
  - Multi-line support for addresses and contact details.
- **Page Configuration**:
  - A4/Letter page sizes.
  - Interactive margin and padding controls.
  - Page background color support.
  - Dual-mode Watermarks (Text/Image) with 9 anchor positions.
- **Instant Export**:
  - Real-time `pdfmake` JSON preview.
  - One-click "Download PDF" directly from the browser.
- **Multi-language Support**:
  - 7 built-in locales: English, Chinese, Spanish, German, Russian, Japanese, and French.
  - Full support for custom translation dictionaries via the `labels` property.
- **UI Configuration**:
  - Granular control over header button visibility (Hide Save, Undo, JSON, etc.).
  - Custom brand colors and border radius.

## 🚀 Getting Started

### Installation

```bash
npm install pdfmake-editor
```

### Basic Usage

```tsx
import { TemplateEditor } from 'pdfmake-editor';

const MyEditor = () => {
  const handleSave = (document) => {
    console.log('Template saved:', document);
  };

  return (
    <div style={{ height: '100vh' }}>
      <TemplateEditor 
        onSave={handleSave}
        config={{
          theme: {
            primaryColor: '#3b82f6',
            borderRadius: '8px'
          }
        }}
      />
    </div>
  );
};
```

## 🔌 API Reference

### TemplateEditor Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `initialData` | `DocumentSchema` | Initial template to load on mount. |
| `onSave` | `(doc: DocumentSchema) => void` | Callback when "Save" is clicked. |
| `onChange` | `(doc: DocumentSchema) => void` | Callback on every document change. |
| `onExport` | `(doc: DocumentSchema) => void` | Callback when "PDF" is exported. |
| `config` | `EditorConfig` | Theme and localization settings. |
| `locale` | `string` | Current UI locale (default: 'en'). |

### EditorConfig Object

```tsx
{
  theme: {
    primaryColor: string;
    accentColor?: string;
    fontFamily?: string;
    borderRadius?: string;
  },
  locale?: 'en' | 'zh' | 'es' | 'de' | 'ru' | 'ja' | 'fr'; // Built-in locales
  labels?: Record<string, string>; // Replace any UI text (custom translations)
  hideHeaderButtons?: {
    template?: boolean;
    save?: boolean;
    undo?: boolean;
    redo?: boolean;
    help?: boolean;
    fullscreen?: boolean;
    exportPdf?: boolean;
    json?: boolean;
  };
}
```

## 🛠️ Development

### Scripts

- `npm run storybook`: Start the interactive component playground on port 6006.
- `npm run build`: Create a production-ready bundle.
- `npm run test`: Run the test suite.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Created by **[novasingh](https://github.com/novasingh)**