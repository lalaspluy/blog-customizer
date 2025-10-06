import { createRoot } from 'react-dom/client';
import { StrictMode, useState, useEffect } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { defaultArticleState } from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	// Состояние для примененных настроек
	const [articleSettings, setArticleSettings] = useState(defaultArticleState);
	// Состояние сайдбара
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		const root = document.documentElement;

		// Устанавливаем CSS-переменные на корневом элементе
		root.style.setProperty(
			'--font-family',
			articleSettings.fontFamilyOption.value
		);
		root.style.setProperty('--font-size', articleSettings.fontSizeOption.value);
		root.style.setProperty('--font-color', articleSettings.fontColor.value);
		root.style.setProperty(
			'--container-width',
			articleSettings.contentWidth.value
		);
		root.style.setProperty('--bg-color', articleSettings.backgroundColor.value);
	}, [articleSettings]); // Эффект срабатывает только при изменении articleSettings

	return (
		<main className={clsx(styles.main)}>
			<ArticleParamsForm
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				onOpen={() => setIsSidebarOpen(true)}
				onApply={setArticleSettings}
				currentSettings={articleSettings}
			/>
			<Article />
		</main>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
