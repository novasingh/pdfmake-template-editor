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
    alignment?: Alignment;
    margin?: [number, number, number, number]; // [left, top, right, bottom]
    padding?: [number, number, number, number];
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
    | 'payment-terms';

export interface BaseElement {
    id: string;
    type: ElementType;
    style: BaseStyle;
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
}

export interface TableCell {
    content: string[]; // IDs of nested elements
}

export interface TableElement extends BaseElement {
    type: 'table';
    rows: number;
    cols: number;
    headerRow: boolean;
    headerColor?: string;
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
}

export type EditorElement =
    | TextElement
    | ImageElement
    | DividerElement
    | ColumnsElement
    | TableElement
    | BusinessInfoElement;

export interface DocumentSchema {
    page: PageSettings;
    elements: Record<string, EditorElement>;
    rootElementIds: string[]; // Order of top-level blocks
}
