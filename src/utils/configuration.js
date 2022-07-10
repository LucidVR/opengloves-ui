import {parse} from 'comment-json';

import {deepOverwrite} from "./object";

import {makeHTTPRequest} from "./http";

import vrsettings from "../resources/vrsettings.json";
import configuration_options from "../strings/configuration_options.json";

export const primaryConfigurationSection = "driver_openglove";

/***
 * Returns values for configuration properties provided using external executable
 * @param configObj {Object} Object for properties
 * @return {Promise<String>} Return values from properties provided
 */
const getValuesForConfiguration = async (configObj) => makeHTTPRequest("settings/get", "POST", configObj);
export const saveConfiguration = async (configObj) => makeHTTPRequest('settings/set', 'POST', configObj);

export const readDefaultConfiguration = () => vrsettings;

export const getConfiguration = async () => {
    const defaultConfig = await readDefaultConfiguration();
    const openVRConfigValues = await getValuesForConfiguration(defaultConfig);

    deepOverwrite(defaultConfig, parse(openVRConfigValues));
    return parseConfiguration(defaultConfig);
};


export const createConfiguration = (configurationOptions) => {
    const temp = JSON.parse(JSON.stringify(configurationOptions));

    const result = {}
    result[primaryConfigurationSection] = temp[primaryConfigurationSection].options;

    delete temp[primaryConfigurationSection];
    Object.entries(temp).forEach(([k, v]) => {
        if (Array.isArray(v.options)) {
            v.options.forEach((v2, k2) => {
                result[v2.key] = v2.options;
            });
        } else {
            result[k] = v.options;
        }
    });
    return result;
}


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
            section1 (ie pose_configuration): {
                options: [{
                    property: value
                }]
            },
            section2 (ie communication_method): {
                options: [
                    {
                        property: value
                    },
                    {
                        property: value
                    },
                ]
            ]
        }
    }
 */
export const parseConfiguration = (configObj) => {
    console.log(configObj);
    const result = {};
    result[primaryConfigurationSection] = {
        title: configuration_options.sections[primaryConfigurationSection],
        options: {},
    };

    Object.entries(configObj[primaryConfigurationSection]).forEach(([k, v]) => {
        const sectionHasOptions = configuration_options.__sections.includes(k);
        if (sectionHasOptions)
            result[k] = {
                title: configuration_options.sections[k],
                options: []
            };
        result[primaryConfigurationSection].options[k] = v;
    });

    Object.entries(configObj).forEach(([k, v]) => {

        //trim properties for options
        const {__type, ...options} = v;

        if ('__type' in v) {
            const parsed = parseComment(v['__type'], false);
            result[Object.keys(parsed)[0]].options[Object.values(parsed)[0]] = {
                key: k,
                options,
            };

        } else {
            result[k] = {
                title: configuration_options.sections[k],
                options,
            };
        }

    });

    return result;
};

const parseComment = (comment, whitespace = true) => {
    if (!whitespace) comment = comment.replaceAll(' ', '');
    const split = comment.replace(/\/\//g, '').split(',');

    let result = {};

    split.forEach(v => {
        const item = v.split(':');
        result[item[0]] = item[1];
    });

    return result;
}
