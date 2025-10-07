import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
	defaultArticleState,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
} from 'src/constants/articleProps';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

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

	const isOpenRef = useRef(isOpen);
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		isOpenRef.current = isOpen;
	}, [isOpen]);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

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

	useEffect(() => {
		setLocalSettings(currentSettings);
	}, [currentSettings]);

	//Обработчик клика по документу
	const handleDocumentClick = useCallback((event: MouseEvent) => {
		if (isArrowClick.current) {
			isArrowClick.current = false;
			return;
		}

		const isInsideSidebar = sidebarRef.current?.contains(event.target as Node);

		if (!isInsideSidebar && isOpenRef.current) {
			onCloseRef.current();
		}
	}, []);

	//Подписка на клики по документу
	useEffect(() => {
		document.addEventListener('mousedown', handleDocumentClick);
		return () => {
			document.removeEventListener('mousedown', handleDocumentClick);
		};
	}, [handleDocumentClick]);

	//Обработчик отправки формы
	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(localSettings);
	};

	//Обработчик сброса формы
	const handleFormReset = (e: React.FormEvent) => {
		e.preventDefault();
		setLocalSettings(defaultArticleState);
		onApply(defaultArticleState);
	};

	//Обработчик клика по стрелке
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
						<Text as='h2' size={31} weight={800} uppercase>
							Задайте параметры
						</Text>
						<Select
							title='Шрифт'
							selected={localSettings.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={(selected) =>
								setLocalSettings({
									...localSettings,
									fontFamilyOption: selected,
								})
							}
						/>
						<RadioGroup
							title='Размер шрифта'
							name='fontSize'
							selected={localSettings.fontSizeOption}
							options={fontSizeOptions}
							onChange={(selected) =>
								setLocalSettings({
									...localSettings,
									fontSizeOption: selected,
								})
							}
						/>
						<Select
							title='Цвет шрифта'
							selected={localSettings.fontColor}
							options={fontColors}
							onChange={(selected) =>
								setLocalSettings({
									...localSettings,
									fontColor: selected,
								})
							}
						/>
						<Separator />

						<Select
							title='Цвет фона'
							selected={localSettings.backgroundColor}
							options={backgroundColors}
							onChange={(selected) =>
								setLocalSettings({
									...localSettings,
									backgroundColor: selected,
								})
							}
						/>

						<Select
							title='Ширина контента'
							selected={localSettings.contentWidth}
							options={contentWidthArr}
							onChange={(selected) =>
								setLocalSettings({
									...localSettings,
									contentWidth: selected,
								})
							}
						/>
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
