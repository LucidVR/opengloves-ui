import {parse} from 'comment-json';

import {readTextFile} from '@tauri-apps/api/fs'
import {deepOverwrite} from "./object";

import ConfigurationStore from '../stores/configuration';
import {openSidecar} from "./sidecar";

export const primaryConfigurationKey = 'opengloves.driver_openglove';

/***
 * Returns values for configuration properties provided using external executable
 * @param configObj {Object} Object for properties
 * @return {Promise<String>} Return values from properties provided
 */
const getValuesForConfiguration = async (configObj) => openSidecar("sidecar", "settings_get", configObj);

export const getConfiguration = async () => {
    const cached = await ConfigurationStore.getConfiguration();
    if(cached) return cached;

    const text = await readTextFile('../resources/settings/default.vrsettings');
    const parsedJSON = parse(text);
    const openVRConfigValues = await getValuesForConfiguration(parsedJSON);

    //passed by reference
    deepOverwrite(parsedJSON, parse(openVRConfigValues));

    const parsed = parseConfiguration(parsedJSON);

    ConfigurationStore.set(parsed);
    return parsed;
};


export const createConfiguration = (configurationOptions) => {
    ConfigurationStore.set(configurationOptions);

    const temp = JSON.parse(JSON.stringify(configurationOptions));

    const result = {};
    result[primaryConfigurationKey] = temp[primaryConfigurationKey].options;

    delete temp[primaryConfigurationKey];
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
 driver_openglove contains the available sections and the one which is currently active.
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
    result[primaryConfigurationKey] = {
        options: {}
    };

    Object.entries(configObj[primaryConfigurationKey]).forEach(([k, v]) => {
        const sectionHasOptions = configObj[primaryConfigurationKey][Symbol.for(`after:${k}`)];
        if (sectionHasOptions) {
            result[k] = {
                title: parseComment(sectionHasOptions[0].value).title,
                options: []
            };
        }

        if(k === '__title')
            result[primaryConfigurationKey].title = v;
        else
            result[primaryConfigurationKey].options[k] = v;

    });
    delete configObj[primaryConfigurationKey];

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
