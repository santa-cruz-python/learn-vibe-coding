// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://santa-cruz-python.github.io',
	base: '/learn-vibe-coding',
	integrations: [
		starlight({
			title: 'Learn Vibe Coding',
			editLink: {
				baseUrl: 'https://github.com/santa-cruz-python/learn-vibe-coding/edit/main/',
			},
			customCss: ['./src/styles/quiet-utility.css', './src/styles/custom.css'],
			components: {
				// Move the page TOC out of the right-hand rail and into the left
				// sidebar, so all navigation lives in one place. See the three
				// overrides in src/components/ for the reasoning.
				Sidebar: './src/components/Sidebar.astro',
				PageSidebar: './src/components/PageSidebar.astro',
				TwoColumnContent: './src/components/TwoColumnContent.astro',
				// Adds the all-rights-reserved notice to every page. The
				// LICENSE file alone isn't visible to anyone reading the site.
				Footer: './src/components/Footer.astro',
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/santa-cruz-python/learn-vibe-coding',
				},
			],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{
							label: 'What is vibe coding?',
							slug: 'start-here/what-is-vibe-coding',
						},
					],
				},
				{
					label: 'Concepts',
					items: [
						{
							label: 'Model, Agent, Harness and Loops',
							slug: 'concepts/model-agent-harness-loops',
						},
					],
				},
				{
					label: 'Getting set up',
					items: [
						{
							label: 'Choosing your tools',
							slug: 'getting-set-up/choosing-your-tools',
						},
					],
				},
				{
					label: 'Building',
					items: [
						{ label: 'Starting a new project', slug: 'building/starting-a-project' },
						{
							label: 'Research, plan, build, verify',
							slug: 'building/research-plan-build-verify',
						},
					],
				},
			],
		}),
	],
});
