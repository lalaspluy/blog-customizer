import { createRoot } from 'react-dom/client';
import { StrictMode, useState, useMemo } from 'react';
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

	const appStyles = useMemo(
		() =>
			({
				'--font-family': articleSettings.fontFamilyOption.value,
				'--font-size': articleSettings.fontSizeOption.value,
				'--font-color': articleSettings.fontColor.value,
				'--container-width': articleSettings.contentWidth.value,
				'--bg-color': articleSettings.backgroundColor.value,
			} as React.CSSProperties),
		[
			articleSettings.fontFamilyOption.value,
			articleSettings.fontSizeOption.value,
			articleSettings.fontColor.value,
			articleSettings.contentWidth.value,
			articleSettings.backgroundColor.value,
		]
	);

	const handleCloseSidebar = useMemo(() => () => setIsSidebarOpen(false), []);
	const handleOpenSidebar = useMemo(() => () => setIsSidebarOpen(true), []);

	return (
		<main className={clsx(styles.main)} style={appStyles}>
			<ArticleParamsForm
				isOpen={isSidebarOpen}
				onClose={handleCloseSidebar}
				onOpen={handleOpenSidebar}
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
