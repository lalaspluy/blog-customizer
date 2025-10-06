import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { useState, useEffect, useRef, useCallback } from 'react';
import { defaultArticleState } from 'src/constants/articleProps';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

/** Функция для обработки применения настроек */
export type OnApply = (settings: typeof defaultArticleState) => void;

type ArticleParamsFormProps = {
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	onApply: OnApply;
	currentSettings: typeof defaultArticleState;
};

export const ArticleParamsForm = ({
	isOpen,
	onClose,
	onOpen,
	onApply,
	currentSettings,
}: ArticleParamsFormProps) => {
	const [localSettings, setLocalSettings] = useState(currentSettings);
	const [isSidebarVisible, setIsSidebarVisible] = useState(false);
	const sidebarRef = useRef<HTMLElement>(null);
	const isArrowClick = useRef(false);

	// Управление видимостью сайдбара с анимацией
	useEffect(() => {
		if (isOpen) {
			setIsSidebarVisible(true);
		} else {
			const timer = setTimeout(() => {
				setIsSidebarVisible(false);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	// Обновление локальных настроек
	useEffect(() => {
		setLocalSettings(currentSettings);
	}, [currentSettings]);

	// Обработчик клика по документу
	const handleDocumentClick = useCallback(
		(event: MouseEvent) => {
			if (isArrowClick.current) {
				isArrowClick.current = false;
				return;
			}

			const isInsideSidebar = sidebarRef.current?.contains(
				event.target as Node
			);

			if (!isInsideSidebar && isOpen) {
				onClose();
			}
		},
		[isOpen, onClose]
	);

	// Подписка на клики по документу
	useEffect(() => {
		document.addEventListener('mousedown', handleDocumentClick);
		return () => {
			document.removeEventListener('mousedown', handleDocumentClick);
		};
	}, [handleDocumentClick]);

	// Обработчик отправки формы
	const handleFormSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			onApply(localSettings);
		},
		[localSettings, onApply]
	);

	// Обработчик сброса формы
	const handleFormReset = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			setLocalSettings(defaultArticleState);
			onApply(defaultArticleState);
		},
		[onApply]
	);

	// Обработчик клика по стрелке
	const handleArrowClick = () => {
		isArrowClick.current = true;

		if (isOpen) {
			onClose();
		} else {
			onOpen();
		}
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={handleArrowClick} />

			{isSidebarVisible && (
				<aside
					ref={sidebarRef}
					className={clsx(styles.container, {
						[styles.container_open]: isOpen,
					})}>
					<form
						className={styles.form}
						onSubmit={handleFormSubmit}
						onReset={handleFormReset}>
						<div className={styles.bottomContainer}>
							<Button title='Сбросить' htmlType='reset' type='clear' />
							<Button title='Применить' htmlType='submit' type='apply' />
						</div>
					</form>
				</aside>
			)}
		</>
	);
};
