import {parse} from 'comment-json';

import {readTextFile} from '@tauri-apps/api/fs'
import {deepOverwrite} from "./object";

import ConfigurationStore from '../stores/configuration';
import {openSidecar} from "./sidecar";
import {makeHTTPRequest} from "./http";

export const primaryConfigurationSection = "driver_openglove";

/***
 * Returns values for configuration properties provided using external executable
 * @param configObj {Object} Object for properties
 * @return {Promise<String>} Return values from properties provided
 */
const getValuesForConfiguration = async (configObj) => makeHTTPRequest("settings/get", "POST", configObj);

export const readDefaultConfiguration = async () => {
    const text = await readTextFile('../resources/settings/default.vrsettings');
    return parse(text);
}

export const getConfiguration = async () => {
    const cached = await ConfigurationStore.getConfiguration();
    if(cached) return {configurationOptions: cached, fromCache: true};

    const defaultConfig = await readDefaultConfiguration();
    const openVRConfigValues = await getValuesForConfiguration(defaultConfig);
    deepOverwrite(defaultConfig, parse(JSON.stringify(openVRConfigValues)));

    const parsed = parseConfiguration(defaultConfig);

    ConfigurationStore.set(parsed);
    return {configurationOptions: parsed, fromCache: false};
};


export const createConfiguration = (configurationOptions) => {
    ConfigurationStore.set(configurationOptions);

    const temp = JSON.parse(JSON.stringify(configurationOptions));

    const result = {}
    result[primaryConfigurationSection] = temp[primaryConfigurationSection].options;

    delete temp[primaryConfigurationSection];
    Object.entries(temp).forEach(([k,v]) => {
        if(Array.isArray(v.options)) {
            v.options.forEach((v2, k2) => {
                result[v2.key] = v2.options;
            });
        } else {
            result[k] = v.options;
        }
    });
    return result;
}

export const saveConfiguration = async (configObj) => openSidecar("sidecar", "settings_set", configObj);

/***
 * Gets ids associated with each configuration object.
 */


/***
 One configuration section can have multiple different options associated with it. For example, communication method has bluetooth, serial, etc.
 A section can also not have multiple options, for example pose configuration.
 We read a comment from the configuration file (stored as a symbol). If it's a "section" we go ahead an set it, and find all its available options
 the primary configuration section contains the available sections and the one which is currently active.
 */
/*
    result = {
        sections: {
            section1 (ie Pose Configuration): {
                title: Pose Configuration
                options: [{
                    property: value
                }]
            },
            section2 (ie Communication Method): {
                title: Communication Method,
                options: [
                    {
                        title: Bluetooth
                        property: value
                    },
                    {
                        title: Serial
                        property: value
                    },
                ]
            ]
        }
    }
 */
export const parseConfiguration = (configObj) => {
    const result = {};
    result[primaryConfigurationSection] = {
        options: {},
    };

    Object.entries(configObj[primaryConfigurationSection]).forEach(([k, v]) => {
        const sectionHasOptions = configObj[primaryConfigurationSection][Symbol.for(`after:${k}`)];
        if (sectionHasOptions) {
            result[k] = {
                title: parseComment(sectionHasOptions[0].value).title,
                options: []
            };
        }

        if(k === '__title')
            result[primaryConfigurationSection].title = v;
        else
            result[primaryConfigurationSection].options[k] = v;

    });
    delete configObj[primaryConfigurationSection];

    Object.entries(configObj).forEach(([k, v]) => {

        //trim properties for options
        const {__type, __title, ...options} = v;

        if ('__type' in v) {
            const parsed = parseComment(v['__type'], false);
            result[Object.keys(parsed)[0]].options[Object.values(parsed)[0]] = {
                title: configObj[k]['__title'],
                key: k,
                options,
            };
        } else {
            result[k] = {
                title: v.__title,
                options,
            };
        }

    });
    return result;
};

const parseComment = (comment, whitespace = true) => {
    if(!whitespace) comment = comment.replaceAll(' ', '');
    const split = comment.replace(/\/\//g, '').split(',');

    let result = {};

    split.forEach(v => {
        const item = v.split(':');
        result[item[0]] = item[1];
    });

    return result;
}
