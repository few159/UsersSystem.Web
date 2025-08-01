import styles from './Modal.module.scss';
import type { ReactNode } from 'react';

interface ModalProps {
    overlayCloseModal?: boolean;
    hideCloseBtn?: boolean;
    onClose: () => void;
    children: ReactNode
}
export default function Modal({
    onClose,
    children,
    overlayCloseModal = true,
    hideCloseBtn = false
}: ModalProps) {
    return (
        <section className={styles.modalJail}>

            <div
                className={styles.overlay}
                onClick={() => { if (overlayCloseModal) onClose() }}
            />

            <section className={styles.modal}>
                {
                    !hideCloseBtn ?
                        <button
                            className={styles.closeBtn}
                            onClick={onClose}
                        >
                            ❌
                        </button>
                        : null
                }
                <section className={styles.content}>
                    {children}
                </section>
            </section>
        </section>
    )
}