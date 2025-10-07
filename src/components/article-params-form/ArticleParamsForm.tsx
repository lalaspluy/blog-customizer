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

	// Строго типизированные обработчики
	const updateSetting = <K extends keyof typeof localSettings>(
		key: K,
		value: (typeof localSettings)[K]
	) => {
		setLocalSettings((prev) => ({ ...prev, [key]: value }));
	};

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
		isArrowClick.current = true;
		isOpen ? onClose() : onOpen();
	};

	// Обработчик клика по документу
	useEffect(() => {
		const handleDocumentClick = (event: MouseEvent) => {
			if (isArrowClick.current) {
				isArrowClick.current = false;
				return;
			}

			if (!sidebarRef.current?.contains(event.target as Node) && isOpen) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleDocumentClick);
		return () => document.removeEventListener('mousedown', handleDocumentClick);
	}, [isOpen, onClose]);

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
								updateSetting('fontFamilyOption', selected)
							}
						/>

						<RadioGroup
							title='Размер шрифта'
							name='fontSize'
							selected={localSettings.fontSizeOption}
							options={fontSizeOptions}
							onChange={(selected) => updateSetting('fontSizeOption', selected)}
						/>

						<Select
							title='Цвет шрифта'
							selected={localSettings.fontColor}
							options={fontColors}
							onChange={(selected) => updateSetting('fontColor', selected)}
						/>

						<Separator />

						<Select
							title='Цвет фона'
							selected={localSettings.backgroundColor}
							options={backgroundColors}
							onChange={(selected) =>
								updateSetting('backgroundColor', selected)
							}
						/>

						<Select
							title='Ширина контента'
							selected={localSettings.contentWidth}
							options={contentWidthArr}
							onChange={(selected) => updateSetting('contentWidth', selected)}
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
