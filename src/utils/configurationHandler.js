import HJSON from 'hjson'
import { readTextFile, writeFile } from '@tauri-apps/api/fs'
import {currentDir} from '@tauri-apps/api/path'


export const getSettingsPath = async () => {
    let path = await currentDir();
    path +=  '../resources/settings/default.vrsettings';

    return path;
}

export const getConfiguration = async () => {
    const result = await readTextFile(await getSettingsPath());
    return HJSON.parse(result, {keepWsc: true});
};

export const createConfiguration = (configurationOptions, configurationItems) => {
    let specialOptions = [];
    Object.entries(configurationOptions).forEach(([key, value]) => {
        let options = {}
        if (value.multi) {
            specialOptions.push({ key, value: value.selectedOption.key })
            options = value.options[value.selectedOption.key].options
            key = value.selectedOption.value
        } else {
            options = value.options
        }

        Object.entries(options).forEach(([k, v]) => configurationItems[key][k] = v.value);

    })

    specialOptions.forEach(v => {
        configurationItems.driver_openglove[v.key] = v.value
    });

    return HJSON.stringify(configurationItems, {
        keepWsc: true,
        separator: true,
        quotes: 'all',
    });
}

export const saveConfiguration = async (string) => writeFile({contents: string, path: await getSettingsPath()});

/***
 * Gets ids associated with each configuration object.
 * @param hjson
 */
export const extractItems = (hjson) => {

    const comments = HJSON.comments.extract(hjson);

    //merge the comments back in
    HJSON.comments.merge(comments, hjson);

    const titles = comments.s.driver_openglove.x.s;
    Object.entries(titles).forEach(([k, v]) => {
        titles[k] = v.a.replace('//', '').split(':')[1]
    });

    let result = {};

    Object.entries(hjson).forEach(([objKey, objValue]) => {

        //If we have a configuration option, add it to the list to choose from
        if (objValue['__type']) {
            const split = objValue['__type'].replace(' ', '').split(':');

            //key: type of configuration, ie. communication_protocol, encoding_protocol...
            const key = split[0];
            const value = parseInt(split[1]);

            if (typeof result[key] !== 'object') {
                result[key] = {
                    title: titles[key],
                    multi: true,
                    options: {},
                };
            }
            if(hjson.driver_openglove[key] === value) {
                result[key].selectedOption = {
                  key: value,
                  value: objKey,
                };
            }

            result[key].options[value] = {
                configKey: objKey,
                title: objValue['__title'],
                options: getAvailableConfigurationEntries(hjson[objKey], comments[objKey]?.x?.s),
            };
        } else {
            result[objKey] = {
                title: objValue['__title'],
                multi: false,
                options: getAvailableConfigurationEntries(objValue, comments[objKey]?.x?.s),
            }
        }
    });
    return result;
};

const getAvailableConfigurationEntries = (options, comments) => {
    let result = {};
    Object.entries(options).forEach(([k, v]) => {
        if(k !== '__type' && k !== '__title')  result[k] = {
            value: v,
            title: comments?.[k]?.a ? parseComment(comments?.[k]?.a).title : k,
        }
    });

    return result;
}

const parseComment = (comment) => {
    //split at each property
    const split = comment.replace(/\/\//g, '').replace(' ', '').split(',');

    let result = {};

    split.forEach(v => {
        const item = v.split(':');
        result[item[0]] = item[1];
    });

    return result;
}
