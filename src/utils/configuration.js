import {parse} from "comment-json";

import {Command} from '@tauri-apps/api/shell'

import {readTextFile} from '@tauri-apps/api/fs'
import {removeNewlines} from "./string";
import {deepOverwrite} from "./object";

const getValuesForConfiguration = async (configObj) => openSidecar("get", configObj);

export const getConfiguration = async () => {
    const text = await readTextFile('../resources/settings/default.vrsettings');
    const openVRConfigValues = await getValuesForConfiguration(removeNewlines(text));
    const parsed = parse(text);

    const result = deepOverwrite(parsed, parse(openVRConfigValues));
    return parsed;
};


export const createConfiguration = (configurationOptions) => {
    const temp = JSON.parse(JSON.stringify(configurationOptions));

    const result = {
        driver_openglove: temp.driver_openglove.options,
    };

    delete temp.driver_openglove;
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

const openSidecar = async (command, data) => {
    const sidecar = Command.sidecar('openglove_ui_sidecar');

    const promiseDataReceived = new Promise((resolve, reject) => {
        sidecar.stdout.on('data', e => resolve(e));
        sidecar.stderr.on('data', e => reject(e));
    });

    const child = await sidecar.spawn();
    await child.write(command + "\n");
    await child.write(data + "\n");

    return await promiseDataReceived;

}
export const saveConfiguration = async (configObj) => openSidecar("set", JSON.stringify(configObj));

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
    const result = {
            driver_openglove: {
                options: {},
            },
    };

    Object.entries(configObj.driver_openglove).forEach(([k, v]) => {
        const sectionHasOptions = configObj.driver_openglove[Symbol.for(`after:${k}`)];
        if (sectionHasOptions) {
            result[k] = {
                title: parseComment(sectionHasOptions[0].value).title,
                options: []
            };
        }

        if(k === '__title')
            result.driver_openglove.title = v;
        else
            result.driver_openglove.options[k] = v;

    });
    delete configObj.driver_openglove;

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
