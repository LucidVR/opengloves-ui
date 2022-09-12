import strings from '$lib/config/strings.json';

const capitalise_first_letter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const pretty_print_text = (string: string) => {
	const arr = string.split('_');
	return arr.map((v) => capitalise_first_letter(v)).join(' ');
};

export const pretty_print_section = (section: keyof typeof strings.sections) => {
	return strings.sections[section] ?? pretty_print_text(section);
};

interface KeyPropertiesInterface {
	label: string;
	description: string;
}

export const pretty_print_key = <T extends keyof typeof strings.keys>(
	section: T,
	key: keyof typeof strings.keys[T]
) =>
	(strings.keys[section]?.[key] as KeyPropertiesInterface)?.label ??
	pretty_print_text(key as string);

export const get_description_for_key = <T extends keyof typeof strings.keys>(
	section: T,
	key: keyof typeof strings.keys[T]
) => (strings.keys[section]?.[key] as KeyPropertiesInterface)?.description ?? null;
