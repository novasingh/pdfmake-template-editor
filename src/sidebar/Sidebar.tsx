import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import '../styles/Sidebar.css';
import DraggableBlock from './DraggableBlock';
import { ElementType } from '../types/editor';
import { useLocalization } from '../hooks/useLocalization';

const BlockSection: React.FC<{
    title: string;
    blocks: { type: ElementType; label: string; moduleName?: string }[];
    t: (key: string, def: string) => string;
    isOpen: boolean;
    onToggle: () => void;
}> = ({ title, blocks, t, isOpen, onToggle }) => (
    <div className={`sidebar-section ${isOpen ? 'is-open' : ''}`}>
        <h3 className="section-title" onClick={onToggle}>
            {t(title, title)}
            <span className="section-arrow">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        </h3>
        <div className="section-content">
            <div className="block-grid">
                {blocks.map((block, idx) => (
                    <DraggableBlock
                        key={`${block.type}-${idx}`}
                        type={block.type}
                        label={t(block.label, block.label)}
                        moduleName={block.moduleName}
                    />
                ))}
            </div>
        </div>
    </div>
);

const Sidebar: React.FC = () => {
    const { t } = useLocalization();
    const [activeTab, setActiveTab] = useState<'blocks' | 'page'>('blocks');
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        'Standard Blocks': true,
        'Business Blocks': true,
        'Compliance': false,
    });
    const { document: doc, setPageSettings } = useEditorStore();
    const { page } = doc;

    const standardBlocks: { type: ElementType; label: string }[] = [
        { type: 'heading', label: 'Heading' },
        { type: 'paragraph', label: 'Paragraph' },
        { type: 'list', label: 'List' },
        { type: 'divider', label: 'Divider' },
        { type: 'image', label: 'Image' },
        { type: 'table', label: 'Table' },
        { type: 'columns', label: 'Columns' },
    ];

    const businessBlocks: { type: ElementType; label: string }[] = [
        { type: 'client-info', label: 'Client Info' },
        { type: 'business-info', label: 'Business Info' },
        { type: 'date-field', label: 'Date Field' },
        { type: 'auto-number', label: 'Auto Number' },
        { type: 'variable', label: 'Dynamic Variable' },
        { type: 'qrcode', label: 'QR Code' },
        { type: 'barcode', label: 'Barcode' },
        { type: 'invoice-items', label: 'Invoice Items' },
        { type: 'invoice-summary', label: 'Totals Section' },
        { type: 'price-table', label: 'Pricing Table' },
        { type: 'payment-terms', label: 'Payment Terms' },
        { type: 'signature', label: 'Signature' },
    ];

    const complianceBlocks = [
        { type: 'abn-field' as ElementType, label: 'ABN Field' },
        { type: 'bank-details' as ElementType, label: 'Bank Details' },
        { type: 'table' as ElementType, label: 'AU Header', moduleName: 'AU_BUSINESS_HEADER' },
        { type: 'table' as ElementType, label: 'Bank Details (Mod)', moduleName: 'AU_BANK_DETAILS' },
        { type: 'table' as ElementType, label: 'Tax Summary', moduleName: 'AU_TAX_SUMMARY' },
    ];

    const handleMarginChange = (key: keyof typeof page.margins, value: string) => {
        const numValue = parseInt(value, 10) || 0;
        setPageSettings({
            margins: { ...page.margins, [key]: numValue }
        });
    };

    return (
        <div className="sidebar">
            <div className="sidebar-tabs">
                <button
                    className={`tab-btn ${activeTab === 'blocks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blocks')}
                >
                    {t('Blocks', 'Blocks')}
                </button>
                <button
                    className={`tab-btn ${activeTab === 'page' ? 'active' : ''}`}
                    onClick={() => setActiveTab('page')}
                >
                    {t('Page Properties', 'Page Properties')}
                </button>
            </div>

            <div className="sidebar-content">
                {activeTab === 'blocks' && (
                    <div className="blocks-tab">
                        <BlockSection
                            title="Standard Blocks"
                            blocks={standardBlocks}
                            t={t}
                            isOpen={!!openSections['Standard Blocks']}
                            onToggle={() => setOpenSections(prev => ({ ...prev, 'Standard Blocks': !prev['Standard Blocks'] }))}
                        />
                        <BlockSection
                            title="Business Blocks"
                            blocks={businessBlocks}
                            t={t}
                            isOpen={!!openSections['Business Blocks']}
                            onToggle={() => setOpenSections(prev => ({ ...prev, 'Business Blocks': !prev['Business Blocks'] }))}
                        />
                        <BlockSection
                            title="Compliance"
                            blocks={complianceBlocks}
                            t={t}
                            isOpen={!!openSections['Compliance']}
                            onToggle={() => setOpenSections(prev => ({ ...prev, 'Compliance': !prev['Compliance'] }))}
                        />
                    </div>
                )}

                {activeTab === 'page' && (
                    <div className="page-props-tab">
                        <div className="prop-group">
                            <label>{t('Page Size', 'Page Size')}</label>
                            <select
                                value={page.size}
                                onChange={(e) => setPageSettings({ size: e.target.value as any })}
                            >
                                <option value="A4">A4</option>
                                <option value="LETTER">Letter</option>
                                <option value="LEGAL">Legal</option>
                            </select>
                        </div>

                        <div className="prop-group">
                            <label>{t('Margins (mm)', 'Margins (mm)')}</label>
                            <div className="margin-grid">
                                <div>
                                    <span>{t('Top', 'Top')}</span>
                                    <input
                                        type="number"
                                        value={page.margins.top}
                                        onChange={(e) => handleMarginChange('top', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <span>{t('Bottom', 'Bottom')}</span>
                                    <input
                                        type="number"
                                        value={page.margins.bottom}
                                        onChange={(e) => handleMarginChange('bottom', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <span>{t('Left', 'Left')}</span>
                                    <input
                                        type="number"
                                        value={page.margins.left}
                                        onChange={(e) => handleMarginChange('left', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <span>{t('Right', 'Right')}</span>
                                    <input
                                        type="number"
                                        value={page.margins.right}
                                        onChange={(e) => handleMarginChange('right', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="prop-group">
                            <label>{t('Page Padding (mm)', 'Page Padding (mm)')}</label>
                            <input
                                type="number"
                                value={page.padding}
                                onChange={(e) => setPageSettings({ padding: parseInt(e.target.value, 10) || 0 })}
                            />
                        </div>

                        <div className="prop-group">
                            <label>{t('Background Color', 'Background Color')}</label>
                            <input
                                type="color"
                                value={page.backgroundColor || '#ffffff'}
                                onChange={(e) => setPageSettings({ backgroundColor: e.target.value })}
                            />
                        </div>


                        <div className="prop-group watermark-section">
                            <h3 style={{ fontSize: '12px', margin: '20px 0 10px', color: '#1e293b' }}>{t('Watermark Settings', 'Watermark Settings')}</h3>

                            <div className="radio-group" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'none', fontSize: '13px' }}>
                                    <input
                                        type="radio"
                                        name="wm-type"
                                        checked={page.watermark?.type === 'text'}
                                        onChange={() => setPageSettings({ watermark: { ...(page.watermark || {}), type: 'text', textValue: page.watermark?.textValue || 'DRAFT' } as any })}
                                    />
                                    {t('Text', 'Text')}
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'none', fontSize: '13px' }}>
                                    <input
                                        type="radio"
                                        name="wm-type"
                                        checked={page.watermark?.type === 'image'}
                                        onChange={() => setPageSettings({ watermark: { ...(page.watermark || {}), type: 'image' } as any })}
                                    />
                                    {t('Image', 'Image')}
                                </label>
                            </div>

                            {page.watermark?.type === 'text' && (
                                <div className="wm-text-props">
                                    <div className="prop-group">
                                        <span>{t('Content', 'Content')}</span>
                                        <input
                                            type="text"
                                            value={page.watermark.textValue || ''}
                                            onChange={(e) => setPageSettings({ watermark: { ...page.watermark, textValue: e.target.value } as any })}
                                        />
                                    </div>
                                    <div className="wm-grid-2">
                                        <div>
                                            <span>{t('Size', 'Size')}</span>
                                            <input
                                                type="number"
                                                value={page.watermark.fontSize || 60}
                                                onChange={(e) => setPageSettings({ watermark: { ...page.watermark, fontSize: parseInt(e.target.value, 10) } as any })}
                                            />
                                        </div>
                                        <div>
                                            <span>{t('Color', 'Color')}</span>
                                            <input
                                                type="color"
                                                value={page.watermark.color || '#000000'}
                                                onChange={(e) => setPageSettings({ watermark: { ...page.watermark, color: e.target.value } as any })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {page.watermark?.type === 'image' && (
                                <div className="wm-image-props">
                                    <div className="prop-group">
                                        <span>{t('Image URL / Base64', 'Image URL / Base64')}</span>
                                        <textarea
                                            rows={2}
                                            value={page.watermark.imageUrl || ''}
                                            onChange={(e) => setPageSettings({ watermark: { ...page.watermark, imageUrl: e.target.value } as any })}
                                            placeholder="Paste source here..."
                                            style={{ width: '100%', fontSize: '12px' }}
                                        />
                                    </div>
                                    <div className="wm-grid-2">
                                        <div>
                                            <span>{t('Width', 'Width')}</span>
                                            <input
                                                type="number"
                                                value={page.watermark.width || 200}
                                                onChange={(e) => setPageSettings({ watermark: { ...page.watermark, width: parseInt(e.target.value, 10) } as any })}
                                            />
                                        </div>
                                        <div>
                                            <span>{t('Height', 'Height')}</span>
                                            <input
                                                type="number"
                                                value={page.watermark.height || 200}
                                                onChange={(e) => setPageSettings({ watermark: { ...page.watermark, height: parseInt(e.target.value, 10) } as any })}
                                            />
                                        </div>
                                    </div>
                                    <div className="wm-grid-2">
                                        <div>
                                            <span>{t('Border Px', 'Border Px')}</span>
                                            <input
                                                type="number"
                                                value={page.watermark.borderWidth || 0}
                                                onChange={(e) => setPageSettings({ watermark: { ...page.watermark, borderWidth: parseInt(e.target.value, 10) } as any })}
                                            />
                                        </div>
                                        <div>
                                            <span>{t('Radius', 'Radius')}</span>
                                            <input
                                                type="number"
                                                value={page.watermark.borderRadius || 0}
                                                onChange={(e) => setPageSettings({ watermark: { ...page.watermark, borderRadius: parseInt(e.target.value, 10) } as any })}
                                            />
                                        </div>
                                    </div>
                                    <div className="prop-group">
                                        <span>{t('Border Color', 'Border Color')}</span>
                                        <input
                                            type="color"
                                            value={page.watermark.borderColor || '#000000'}
                                            onChange={(e) => setPageSettings({ watermark: { ...page.watermark, borderColor: e.target.value } as any })}
                                        />
                                    </div>
                                </div>
                            )}

                            {page.watermark && (
                                <div className="wm-common-props" style={{ marginTop: '15px' }}>
                                    <div className="prop-group">
                                        <label>{t('Alignment', 'Alignment')}</label>
                                        <div className="pos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '5px' }}>
                                            {(['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'] as any[]).map(pos => (
                                                <button
                                                    key={pos}
                                                    title={pos}
                                                    className={page.watermark?.position === pos ? 'active' : ''}
                                                    onClick={() => setPageSettings({ watermark: { ...page.watermark, position: pos } as any })}
                                                    style={{ height: '30px', border: '1px solid #e2e8f0', background: page.watermark?.position === pos ? '#3b82f6' : 'white', cursor: 'pointer', fontSize: '10px' }}
                                                >
                                                    {pos.split('-').map((p: string) => p[0].toUpperCase()).join('')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="prop-group">
                                        <label>{t('Opacity', 'Opacity')} ({Math.round((page.watermark.opacity || 0.1) * 100)}%)</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={page.watermark.opacity || 0.1}
                                            onChange={(e) => setPageSettings({ watermark: { ...page.watermark, opacity: parseFloat(e.target.value) } as any })}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
