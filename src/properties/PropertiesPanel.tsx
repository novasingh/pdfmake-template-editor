import React, { useCallback } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { EditorElement } from '../types/editor';
import { useLocalization } from '../hooks/useLocalization';
import TextProperties from './components/TextProperties';
import DividerProperties from './components/DividerProperties';
import ImageProperties from './components/ImageProperties';
import TableProperties from './components/TableProperties';
import InfoProperties from './components/InfoProperties';
import ColumnProperties from './components/ColumnProperties';
import DateProperties from './components/DateProperties';
import VariableProperties from './components/VariableProperties';
import QRCodeProperties from './components/QRCodeProperties';
import BarcodeProperties from './components/BarcodeProperties';
import ListProperties from './components/ListProperties';
import AutoNumberProperties from './components/AutoNumberProperties';
import ABNProperties from './components/ABNProperties';
import BankDetailsProperties from './components/BankDetailsProperties';
import '../styles/PropertiesPanel.css';

const PropertiesPanel: React.FC = () => {
    const { t } = useLocalization();
    const {
        selectedElementId,
        document: doc,
        updateElement,
        addTableRow,
        addTableColumn,
        removeTableRow,
        removeTableColumn,
        removeElement
    } = useEditorStore();

    const element = selectedElementId ? doc.elements[selectedElementId] : null;

    const handleUpdate = useCallback((updates: Partial<EditorElement>) => {
        if (!element) return;
        updateElement(element.id, updates);
    }, [element, updateElement]);

    const handleStyleChange = useCallback((key: string, value: any) => {
        if (!element) return;
        updateElement(element.id, {
            style: { ...element.style, [key]: value }
        });
    }, [element, updateElement]);

    if (!element) {
        return (
            <div className="properties-panel empty">
                <p>{t('Select an element on the canvas to edit its properties.', 'Select an element on the canvas to edit its properties.')}</p>
            </div>
        );
    }

    const renderProperties = () => {
        switch (element.type) {
            case 'heading':
            case 'paragraph':
                return (
                    <TextProperties
                        element={element}
                        onUpdate={handleUpdate}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'divider':
                return (
                    <DividerProperties
                        element={element}
                        onUpdate={handleUpdate}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'image':
                return (
                    <ImageProperties
                        element={element}
                        onUpdate={handleUpdate}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'table':
                return (
                    <TableProperties
                        element={element}
                        onUpdate={handleUpdate}
                        onAddRow={addTableRow}
                        onAddCol={addTableColumn}
                        onRemoveRow={removeTableRow}
                        onRemoveCol={removeTableColumn}
                        onUpdateCell={useEditorStore.getState().updateTableCell}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'columns':
                return (
                    <ColumnProperties
                        element={element as any}
                        onUpdate={handleUpdate}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'client-info':
            case 'business-info':
            case 'signature':
                return (
                    <InfoProperties
                        element={element}
                        onUpdate={handleUpdate}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'date-field':
                return (
                    <DateProperties
                        element={element as any}
                        onUpdate={handleUpdate as any}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'auto-number':
                return (
                    <AutoNumberProperties
                        element={element as any}
                        onUpdate={handleUpdate as any}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'variable':
                return (
                    <VariableProperties
                        element={element as any}
                        onUpdate={handleUpdate as any}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'qrcode':
                return (
                    <QRCodeProperties
                        element={element as any}
                        onUpdate={handleUpdate as any}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'barcode':
                return (
                    <BarcodeProperties
                        element={element as any}
                        onUpdate={handleUpdate as any}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'list':
                return (
                    <ListProperties
                        element={element as any}
                        onUpdate={handleUpdate as any}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'abn-field':
                return (
                    <ABNProperties
                        element={element as any}
                        onUpdate={handleUpdate as any}
                        onStyleChange={handleStyleChange}
                    />
                );
            case 'bank-details':
                return (
                    <BankDetailsProperties
                        element={element as any}
                        onUpdate={handleUpdate as any}
                        onStyleChange={handleStyleChange}
                    />
                );
            default:
                return <p>{t('No properties available for this element.', 'No properties available for this element.')}</p>;
        }
    };

    return (
        <div className="properties-panel">
            <div className="panel-header">
                <h2>{t(element.type.toUpperCase(), element.type.toUpperCase())} {t('Properties', 'Properties')}</h2>
            </div>

            <div className="panel-content">
                {renderProperties()}

                <button
                    className="delete-btn"
                    onClick={() => removeElement(element.id)}
                >
                    {t('Delete Block', 'Delete Block')}
                </button>
            </div>
        </div>
    );
};

export default PropertiesPanel;
