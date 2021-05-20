import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		appName: 'OpenGloves UI'
	}
});

export default app;
