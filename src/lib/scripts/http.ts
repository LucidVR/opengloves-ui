import config from '../config/server.json';

import { http } from '@tauri-apps/api';
import type { HttpVerb } from '@tauri-apps/api/http';

export const make_http_request = async ({
	url = 'http://localhost:',
	path,
	method = 'GET',
	body = {},
	port = config.driver_http_port
}: {
	url?: string;
	path: string;
	method?: HttpVerb;
	body?: object;
	port?: number;
}) => {
	const response = await http.fetch(url + port + path, {
		method,
		body: {
			type: 'Json',
			payload: body
		},
		responseType: 2
	});
	if (response.status === 200) return response.data;

	throw new Error(response.data as string);
};
