/**
 * Core JSON Schema Types for pdfmake-template-editor
 * These types are designed to be 1:1 mappable to pdfmake document definitions.
 */

export type PageSize = 'A4' | 'LETTER' | 'LEGAL';

export interface Margins {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export type Alignment = 'left' | 'center' | 'right' | 'justify';
export type FontWeight = 'normal' | 'bold' | '500' | '600' | '700';

export interface BaseStyle {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: FontWeight;
    color?: string;
    background?: string;
    alignment?: Alignment;
    margin?: [number, number, number, number]; // [left, top, right, bottom]
    padding?: [number, number, number, number];
    opacity?: number;
    decoration?: 'underline' | 'lineThrough' | 'overline' | 'none';
    decorationStyle?: 'dashed' | 'dotted' | 'double' | 'wavy';
    decorationColor?: string;
    lineHeight?: number;
    characterSpacing?: number;
}

export interface WatermarkSettings {
    type: 'text' | 'image';
    textValue?: string;
    imageUrl?: string;
    fontSize?: number;
    fontWeight?: FontWeight;
    color?: string;
    opacity?: number;
    width?: number;
    height?: number;
    fontFamily?: string;
    position?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
}


export interface PageSettings {
    size: PageSize;
    width: number; // mm
    height: number; // mm
    margins: Margins;
    padding: number;
    backgroundColor?: string;
    watermark?: WatermarkSettings;
}

export type ElementType =
    | 'heading'
    | 'paragraph'
    | 'divider'
    | 'image'
    | 'table'
    | 'columns'
    | 'client-info'
    | 'business-info'
    | 'signature'
    | 'invoice-items'
    | 'invoice-summary'
    | 'price-table'
    | 'payment-terms'
    | 'date-field'
    | 'auto-number'
    | 'variable'
    | 'qrcode'
    | 'barcode'
    | 'list'
    | 'abn-field'
    | 'bank-details';

export interface BaseElement {
    id: string;
    type: ElementType;
    style: BaseStyle;
    role?: 'item-qty' | 'item-rate' | 'item-amount' | 'summary-subtotal' | 'summary-gst' | 'summary-total' | 'summary-discount';
    currencyCode?: string; // e.g. 'AUD', 'USD'
}

export interface TextElement extends BaseElement {
    type: 'heading' | 'paragraph';
    content: string;
}

export interface DividerElement extends BaseElement {
    type: 'divider';
    thickness?: number;
    color?: string;
    width?: string | number; // e.g. '100%' or 200
    lineStyle?: 'solid' | 'dashed' | 'dotted';
}

export interface ImageElement extends BaseElement {
    type: 'image';
    src: string;
    width?: string | number;
    height?: string | number;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    borderRadius?: number;
}

export interface Column {
    width: string | number; // e.g., '50%' or 120 (fixed px)
    content: string[]; // IDs of elements inside this column
}

export interface ColumnsElement extends BaseElement {
    type: 'columns';
    columns: Column[];
    columnGap?: number;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
    borderRadius?: number;
    backgroundColor?: string;
    verticalAlign?: 'top' | 'middle' | 'bottom';
    showColumnBorders?: boolean;
    columnBorderWidth?: number;
    columnBorderColor?: string;
}

export interface TableCell {
    content: string[]; // IDs of nested elements
    rowSpan?: number;
    colSpan?: number;
    backgroundColor?: string;
}

export interface TableElement extends BaseElement {
    type: 'table';
    rows: number;
    cols: number;
    headerRow: boolean;
    headerColor?: string;
    alternateRowColor?: string;
    widths?: (number | string)[];
    heights?: (number | string)[];
    cellPadding?: number;
    borderWidth?: number;
    borderColor?: string;
    tableSpacing?: number;
    body: TableCell[][];
}

export interface BusinessInfoElement extends BaseElement {
    type: 'business-info' | 'client-info' | 'signature';
    content?: string;
    headingValue?: string;
    headingStyle?: BaseStyle;
    showLeftBorder?: boolean;
    borderWidth?: number;
    borderColor?: string;
    borderPadding?: number;
}

export interface DateFieldElement extends BaseElement {
    type: 'date-field';
    label?: string;
    dateValue?: string;
    dateFormat?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY';
    showLabel?: boolean;
}

export interface AutoNumberElement extends BaseElement {
    type: 'auto-number';
    prefix?: string;
    suffix?: string;
    startValue?: number;
    paddingDigits?: number;
    label?: string;
}

export interface VariableElement extends BaseElement {
    type: 'variable';
    variableName: string;
    placeholder?: string;
    label?: string;
}

export interface QRCodeElement extends BaseElement {
    type: 'qrcode';
    data: string;
    size?: number;
    errorLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface BarcodeElement extends BaseElement {
    type: 'barcode';
    data: string;
    barcodeType?: 'Code128' | 'Code39' | 'EAN13' | 'UPC';
    width?: number;
    height?: number;
    displayValue?: boolean;
}

export interface ListElement extends BaseElement {
    type: 'list';
    listType: 'ordered' | 'unordered';
    items: string[];
    bulletStyle?: 'disc' | 'circle' | 'square' | 'number' | 'letter';
}

export interface ABNFieldElement extends BaseElement {
    type: 'abn-field';
    abnValue?: string;
    label?: string;
    format?: 'XX XXX XXX XXX' | 'XXXXXXXXXXX';
}

export interface BankDetailsElement extends BaseElement {
    type: 'bank-details';
    bankName?: string;
    accountName?: string;
    bsb?: string;
    accountNumber?: string;
}


export type EditorElement =
    | TextElement
    | ImageElement
    | DividerElement
    | ColumnsElement
    | TableElement
    | BusinessInfoElement
    | DateFieldElement
    | AutoNumberElement
    | VariableElement
    | QRCodeElement
    | BarcodeElement
    | ListElement
    | ABNFieldElement
    | BankDetailsElement;

/**
 * Represents the full state of a PDF template document.
 */
export interface DocumentSchema {
    /** Page settings including size, margins, and watermarks */
    page: PageSettings;
    /** Flat map of all elements by their Unique ID */
    elements: Record<string, EditorElement>;
    /** Ordered list of top-level element IDs (root level drag sequence) */
    rootElementIds: string[];
}

/**
 * Configuration options for customizing the editor's appearance and terminology.
 */
export interface EditorConfig {
    /** Visual theme overrides */
    theme?: {
        /** The primary brand color (used for buttons, active states, etc.) */
        primaryColor?: string;
        /** Accent color used for hover states and highlights */
        accentColor?: string;
        /** Global font family (e.g., "'Inter', sans-serif") */
        fontFamily?: string;
        /** CSS border-radius value (e.g., "8px") */
        borderRadius?: string;
    };
    /** Current UI locale key (e.g., "en", "ja") */
    locale?: string;
    /** Map of UI string overrides to satisfy specific terminology or translation needs */
    labels?: Record<string, string>;
    /** 
     * Selective visibility for header buttons. 
     * Set a property to `true` to hide the corresponding button.
     */
    hideHeaderButtons?: {
        /** Hide the 'Templates' dropdown */
        template?: boolean;
        /** Hide the 'Save' button/dropdown */
        save?: boolean;
        /** Hide the 'Undo' button */
        undo?: boolean;
        /** Hide the 'Redo' button */
        redo?: boolean;
        /** Hide the 'Help' button */
        help?: boolean;
        /** Hide the 'Fullscreen' toggle */
        fullscreen?: boolean;
        /** Hide the 'Print PDF' button */
        exportPdf?: boolean;
        /** Hide the raw 'JSON' preview button */
        json?: boolean;
    };
}

/**
 * Public Props for the TemplateEditor React component.
 */
export interface TemplateEditorProps {
    /** 
     * Initial document schema to load on mount. 
     * If provided, this document will be loaded into the editor state immediately.
     */
    initialData?: DocumentSchema;

    /** 
     * Callback triggered on every document modification. 
     * Ideal for implementing auto-save functionality.
     */
    onChange?: (document: DocumentSchema) => void;

    /** 
     * Callback triggered when the 'Save' button in the header is clicked. 
     */
    onSave?: (document: DocumentSchema) => void;

    /** 
     * Callback triggered when the 'PDF' export button is clicked. 
     */
    onExport?: (document: DocumentSchema) => void;

    /** 
     * Optional configuration for theming and UI label overrides.
     */
    config?: EditorConfig;

    /** 
     * The locale used for UI labels. Defaults to 'en'.
     */
    locale?: string;
}

