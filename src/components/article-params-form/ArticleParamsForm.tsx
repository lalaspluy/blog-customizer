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
	ArticleStateType,
} from 'src/constants/articleProps';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

export type OnApply = (settings: ArticleStateType) => void;

type ArticleParamsFormProps = {
	onApply: OnApply;
	currentSettings: ArticleStateType;
};

export const ArticleParamsForm = ({
	onApply,
	currentSettings,
}: ArticleParamsFormProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isSidebarVisible, setIsSidebarVisible] = useState(false);
	const [localSettings, setLocalSettings] = useState(currentSettings);
	const sidebarRef = useRef<HTMLElement>(null);
	const isArrowButtonClicked = useRef(false);

	useEffect(() => {
		if (isSidebarOpen) {
			setIsSidebarVisible(true);
		} else {
			const hideSidebarTimer = setTimeout(() => {
				setIsSidebarVisible(false);
			}, 500);
			return () => clearTimeout(hideSidebarTimer);
		}
	}, [isSidebarOpen]);

	useEffect(() => {
		if (!isSidebarOpen) return;

		const handleDocumentClick = (event: MouseEvent) => {
			if (isArrowButtonClicked.current) {
				isArrowButtonClicked.current = false;
				return;
			}

			const isClickInsideSidebar = sidebarRef.current?.contains(
				event.target as Node
			);

			if (!isClickInsideSidebar) {
				setIsSidebarOpen(false);
			}
		};

		document.addEventListener('mousedown', handleDocumentClick);
		return () => {
			document.removeEventListener('mousedown', handleDocumentClick);
		};
	}, [isSidebarOpen]);

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onApply(localSettings);
	};

	const handleFormReset = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLocalSettings(defaultArticleState);
		onApply(defaultArticleState);
	};

	const handleArrowButtonClick = () => {
		isArrowButtonClicked.current = true;
		setIsSidebarOpen(!isSidebarOpen);
	};

	const updateSetting = <K extends keyof typeof localSettings>(
		settingName: K,
		newValue: (typeof localSettings)[K]
	) => {
		setLocalSettings((prev) => ({ ...prev, [settingName]: newValue }));
	};

	return (
		<>
			<ArrowButton isOpen={isSidebarOpen} onClick={handleArrowButtonClick} />

			{isSidebarVisible && (
				<aside
					ref={sidebarRef}
					className={clsx(styles.container, {
						[styles.container_open]: isSidebarOpen,
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
