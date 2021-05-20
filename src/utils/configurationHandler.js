const HJSON = require('hjson');
const fs = require('fs');
const path = require('path');

//production
let settingPath;

if(process.env.PORTABLE_EXECUTABLE_DIR) {
    console.log("production mode enabled");
    settingPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, '../resources/settings/default.vrsettings');
} else {
    settingPath = '../driver/resources/settings/default.vrsettings';
}


export const getConfiguration = () => {
    const result = fs.readFileSync(settingPath, 'utf8');
    return HJSON.parse(result, {keepWsc: true});
};

export const saveConfiguration = (saveObj) => {
    const stringified = HJSON.stringify(saveObj, {
        keepWsc: true,
        separator: true,
        quotes: 'all',
    });

    fs.writeFileSync(settingPath, stringified);
}

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
