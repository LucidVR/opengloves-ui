import type { Load } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: Load = () => {
	throw redirect(308, '/configuration');
};
