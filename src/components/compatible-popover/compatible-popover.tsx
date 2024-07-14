import React, { useEffect } from 'react';
import classNames from 'classnames';
import styles from './compatible-popover.css';

interface CompatiblePopoverProps {
    children: React.ReactElement;
    body: React.ReactElement;
    isOpen: boolean;
    onOuterAction?: (event: MouseEvent) => void;
    animated?: boolean;
    arrow?: boolean;
}

/**
 * A popover component that is identical to the original `Popover` used by `scratch-paint`,
 * but without the `react-popover` dependency.
 */
export function CompatiblePopover({
    children,
    body,
    isOpen,
    onOuterAction,
    animated = true,
    arrow = true
}: CompatiblePopoverProps) {
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const onClick = (event: MouseEvent) => {
            const clickTarget = event.target as HTMLElement;
            const tooltipBody = ref.current;
            if (tooltipBody && !tooltipBody.contains(clickTarget)) {
                onOuterAction?.(event);
            }
        }

        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [isOpen, onOuterAction]);

    return (
        <div ref={ref} className={styles.popoverWrapper}>
            {children}
            <div
                className={classNames(
                    styles.popoverBody,
                    {
                        [styles.popoverBodyClosed]: !isOpen,
                        [styles.popoverNotAnimated]: animated === false,
                        [styles.popoverNoArrow]: arrow === false
                    }
                )}
            >
                {body}
            </div>
        </div>
    );
}
