import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import pdfMake from 'pdfmake/build/pdfmake';
import EditorShell from './editor/EditorShell';

interface Element {
  id: number;
  type: 'text' | 'image' | 'hyperlink' | 'table' | 'textarea';
  left: number;
  top: number;
  text?: string;
  src?: string;
  url?: string;
  rows?: number;
  cols?: number;
}

const convertToPdfmake = (elements: Element[]) => {
  const content = elements.map(el => {
    if (el.type === 'text') {
      return { text: el.text, absolutePosition: { x: el.left, y: el.top } };
    }
    if (el.type === 'textarea') {
      return { text: el.text, absolutePosition: { x: el.left, y: el.top } };
    }
    if (el.type === 'hyperlink') {
      return { text: el.text, link: el.url, absolutePosition: { x: el.left, y: el.top } };
    }
    if (el.type === 'image') {
      return { image: el.src, absolutePosition: { x: el.left, y: el.top }, width: 200 };
    }
    if (el.type === 'table') {
      const rows = el.rows || 2;
      const cols = el.cols || 2;
      const body = Array.from({ length: rows }).map(() => Array.from({ length: cols }).map(() => ''));
      return { table: { body }, absolutePosition: { x: el.left, y: el.top } };
    }
    return null;
  }).filter(Boolean);
  return { content };
};

const PdfEditor: React.FC = () => {
  // Keep pdfMake vfs loading for image preview/export if consumer needs it.
  React.useEffect(() => {
    import('pdfmake/build/vfs_fonts').then(pdfFonts => {
      try {
        // @ts-ignore
        (pdfMake as any).vfs = pdfFonts.default?.pdfMake?.vfs || pdfFonts.pdfMake?.vfs || {};
      } catch (e) {
        // ignore
      }
    }).catch(() => {});
  }, []);

  return <EditorShell />;
};

export default PdfEditor;