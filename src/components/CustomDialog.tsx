import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import '../styles/CustomDialog.css';

const CustomDialog: React.FC = () => {
    const { dialog, closeDialog } = useEditorStore();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (dialog) {
            setInputValue(dialog.defaultValue || '');
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [dialog]);

    if (!dialog) return null;

    const handleConfirm = () => {
        if (dialog.onConfirm) {
            dialog.onConfirm(dialog.type === 'prompt' ? inputValue : undefined);
        }
        closeDialog();
    };

    const handleCancel = () => {
        if (dialog.onCancel) {
            dialog.onCancel();
        }
        closeDialog();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const dialogDimensions = dialogRef.current?.getBoundingClientRect();
        if (
            dialogDimensions &&
            (e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom)
        ) {
            handleCancel();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && dialog.type !== 'alert') {
            handleConfirm();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="custom-dialog"
            onClick={handleBackdropClick}
            onCancel={(e) => {
                e.preventDefault();
                handleCancel();
            }}
        >
            <div className="dialog-container">
                {dialog.title && <h3 className="dialog-title">{dialog.title}</h3>}
                <div className="dialog-message">{dialog.message}</div>

                {dialog.type === 'prompt' && (
                    <input
                        type="text"
                        className="dialog-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                )}

                <div className="dialog-actions">
                    {(dialog.type === 'confirm' || dialog.type === 'prompt') && (
                        <button className="dialog-btn secondary" onClick={handleCancel}>
                            {dialog.cancelLabel || 'Cancel'}
                        </button>
                    )}
                    <button className="dialog-btn primary" onClick={handleConfirm}>
                        {dialog.confirmLabel || (dialog.type === 'alert' ? 'OK' : 'Confirm')}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default CustomDialog;
