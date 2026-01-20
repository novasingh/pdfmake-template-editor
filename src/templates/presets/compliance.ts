/**
 * Compliance Certificate Template
 * Generic compliance/certificate template for Australian businesses
 */

import { DocumentSchema } from '../../types/editor';
import { Template, TEMPLATE_VERSION } from '../templateManager';

/**
 * Generate element IDs
 */
const genId = (type: string) => `${type}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Create the Compliance Certificate Template Document
 */
const createComplianceDocument = (): DocumentSchema => {
    // Generate all IDs upfront
    const titleId = genId('heading');
    const subtitleId = genId('heading');
    const dividerId = genId('divider');
    const certNumberId = genId('paragraph');
    const issueDateId = genId('paragraph');
    const divider2Id = genId('divider');
    const certifyTextId = genId('paragraph');
    const recipientId = genId('heading');
    const addressId = genId('paragraph');
    const divider3Id = genId('divider');
    const complianceHeadingId = genId('heading');
    const complianceListId = genId('paragraph');
    const divider4Id = genId('divider');
    const issuedByHeadingId = genId('heading');
    const columnsId = genId('columns');
    const inspectorInfoId = genId('paragraph');
    const signatureId = genId('signature');
    const stampPlaceholderId = genId('paragraph');
    const footerId = genId('paragraph');

    return {
        page: {
            size: 'A4',
            width: 210,
            height: 297,
            margins: { top: 20, right: 20, bottom: 20, left: 20 },
            padding: 0,
            backgroundColor: '#ffffff',
        },
        elements: {
            // Title
            [titleId]: {
                id: titleId,
                type: 'heading',
                content: 'CERTIFICATE OF COMPLIANCE',
                style: {
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#1e3a5f',
                    alignment: 'center',
                    margin: [0, 20, 0, 5]
                }
            },

            // Subtitle
            [subtitleId]: {
                id: subtitleId,
                type: 'heading',
                content: 'Official Document',
                style: {
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: '#64748b',
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                }
            },

            // Divider
            [dividerId]: {
                id: dividerId,
                type: 'divider',
                thickness: 2,
                color: '#1e3a5f',
                width: '60%',
                lineStyle: 'solid',
                style: { margin: [0, 0, 0, 20], alignment: 'center' }
            },

            // Certificate Number
            [certNumberId]: {
                id: certNumberId,
                type: 'paragraph',
                content: 'Certificate Number: CC-2026-00001',
                style: { fontSize: 11, alignment: 'center', color: '#475569', margin: [0, 0, 0, 5] }
            },

            // Issue Date
            [issueDateId]: {
                id: issueDateId,
                type: 'paragraph',
                content: 'Date of Issue: 20 January 2026',
                style: { fontSize: 11, alignment: 'center', color: '#475569', margin: [0, 0, 0, 20] }
            },

            // Divider 2
            [divider2Id]: {
                id: divider2Id,
                type: 'divider',
                thickness: 1,
                color: '#e2e8f0',
                width: '100%',
                lineStyle: 'solid',
                style: { margin: [0, 10, 0, 20] }
            },

            // Certify Text
            [certifyTextId]: {
                id: certifyTextId,
                type: 'paragraph',
                content: 'This is to certify that:',
                style: { fontSize: 12, alignment: 'center', color: '#1e293b', margin: [0, 0, 0, 15] }
            },

            // Recipient Name
            [recipientId]: {
                id: recipientId,
                type: 'heading',
                content: 'RECIPIENT BUSINESS NAME PTY LTD',
                style: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#1e3a5f',
                    alignment: 'center',
                    margin: [0, 0, 0, 5]
                }
            },

            // Address
            [addressId]: {
                id: addressId,
                type: 'paragraph',
                content: '123 Compliance Street\nSydney NSW 2000\nAustralia',
                style: { fontSize: 11, alignment: 'center', color: '#64748b', margin: [0, 0, 0, 20] }
            },

            // Divider 3
            [divider3Id]: {
                id: divider3Id,
                type: 'divider',
                thickness: 1,
                color: '#e2e8f0',
                width: '100%',
                lineStyle: 'solid',
                style: { margin: [0, 10, 0, 20] }
            },

            // Compliance Heading
            [complianceHeadingId]: {
                id: complianceHeadingId,
                type: 'paragraph',
                content: 'Has been inspected and found to comply with:',
                style: { fontSize: 12, alignment: 'center', color: '#1e293b', margin: [0, 0, 0, 15] }
            },

            // Compliance List
            [complianceListId]: {
                id: complianceListId,
                type: 'paragraph',
                content: '☑ Australian Standard AS/NZS 3000 Wiring Rules\n☑ Work Health and Safety Act 2011\n☑ Building Code of Australia (BCA) Requirements\n☑ Environmental Protection Regulations',
                style: { fontSize: 11, alignment: 'center', color: '#475569', margin: [0, 0, 0, 25] }
            },

            // Divider 4
            [divider4Id]: {
                id: divider4Id,
                type: 'divider',
                thickness: 1,
                color: '#e2e8f0',
                width: '100%',
                lineStyle: 'solid',
                style: { margin: [0, 10, 0, 20] }
            },

            // Issued By Heading
            [issuedByHeadingId]: {
                id: issuedByHeadingId,
                type: 'heading',
                content: 'ISSUED BY',
                style: { fontSize: 12, fontWeight: 'bold', color: '#1e293b', alignment: 'center', margin: [0, 0, 0, 15] }
            },

            // Columns for signature and stamp
            [columnsId]: {
                id: columnsId,
                type: 'columns',
                columns: [
                    { width: '50%', content: [inspectorInfoId, signatureId] },
                    { width: '50%', content: [stampPlaceholderId] }
                ],
                columnGap: 40,
                style: { margin: [0, 0, 0, 20] }
            },

            // Inspector Info
            [inspectorInfoId]: {
                id: inspectorInfoId,
                type: 'paragraph',
                content: 'Inspector Name: ________________________\nLicense Number: ________________________\nCompany: ________________________',
                style: { fontSize: 10, color: '#475569', margin: [0, 0, 0, 10] }
            },

            // Signature
            [signatureId]: {
                id: signatureId,
                type: 'signature',
                style: { margin: [0, 10, 0, 0] }
            },

            // Stamp Placeholder
            [stampPlaceholderId]: {
                id: stampPlaceholderId,
                type: 'paragraph',
                content: '[OFFICIAL STAMP/SEAL]',
                style: {
                    fontSize: 12,
                    color: '#94a3b8',
                    alignment: 'center',
                    margin: [0, 40, 0, 0]
                }
            },

            // Footer
            [footerId]: {
                id: footerId,
                type: 'paragraph',
                content: 'This certificate is valid for 12 months from the date of issue unless otherwise specified.',
                style: { fontSize: 9, alignment: 'center', color: '#94a3b8', margin: [0, 30, 0, 0] }
            },
        },
        rootElementIds: [
            titleId,
            subtitleId,
            dividerId,
            certNumberId,
            issueDateId,
            divider2Id,
            certifyTextId,
            recipientId,
            addressId,
            divider3Id,
            complianceHeadingId,
            complianceListId,
            divider4Id,
            issuedByHeadingId,
            columnsId,
            footerId,
        ],
    };
};

/**
 * Compliance Certificate Template
 */
export const complianceTemplate: Template = {
    metadata: {
        id: 'compliance-certificate',
        name: 'Compliance Certificate',
        description: 'Official compliance certificate template with inspection details, standards, and signature.',
        version: TEMPLATE_VERSION,
        revision: 1,
        createdAt: '2026-01-20T00:00:00.000Z',
        updatedAt: '2026-01-20T00:00:00.000Z',
        category: 'compliance',
        locale: 'en-AU',
    },
    document: createComplianceDocument(),
};
