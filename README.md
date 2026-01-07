# pdfmake-template-editor

A powerful, drag-and-drop PDF template editor for React that generates `pdfmake` JSON definitions. Build complex document layouts visually and export them as high-quality PDFs instantly.

## ✨ Features

- **Drag & Drop Interface**: Built with `@dnd-kit` for a smooth, intuitive layout experience.
- **Rich Component Library**:
  - Headings & Paragraphs
  - Images (with resizing and borders)
  - Tables (with dynamic row/column management)
  - Dividers (custom styles and colors)
  - Specialized Business Modules (Client Info, Business Info, Signature Blocks)
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

## 🚀 Getting Started

### Installation

```bash
npm install pdfmake-editor
```

### Basic Usage

```tsx
import { TemplateEditor } from 'pdfmake-editor';

const MyEditor = () => {
  return (
    <div style={{ height: '100vh' }}>
      <TemplateEditor />
    </div>
  );
};
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