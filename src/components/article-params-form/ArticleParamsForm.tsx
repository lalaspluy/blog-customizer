import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { useState, useEffect, useRef } from 'react';
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

type ArticleSettings = typeof defaultArticleState;

export type OnApply = (settings: ArticleSettings) => void;

type ArticleParamsFormProps = {
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	onApply: OnApply;
	currentSettings: ArticleSettings;
};

export const ArticleParamsForm = ({
	isOpen,
	onClose,
	onOpen,
	onApply,
	currentSettings,
}: ArticleParamsFormProps) => {
	const [localSettings, setLocalSettings] = useState(currentSettings);
	const sidebarRef = useRef<HTMLElement>(null);

	// Синхронизация с внешними настройками
	useEffect(() => {
		setLocalSettings(currentSettings);
	}, [currentSettings]);

	// Обработчик клика вне сайдбара
	useEffect(() => {
		if (!isOpen) return;

		const handleDocumentClick = (event: MouseEvent) => {
			if (!sidebarRef.current?.contains(event.target as Node)) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleDocumentClick);
		return () => document.removeEventListener('mousedown', handleDocumentClick);
	}, [isOpen, onClose]);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(localSettings);
	};

	const handleFormReset = (e: React.FormEvent) => {
		e.preventDefault();
		setLocalSettings(defaultArticleState);
		onApply(defaultArticleState);
	};

	const handleArrowClick = () => {
		isOpen ? onClose() : onOpen();
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={handleArrowClick} />

			{isOpen && (
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
