const path = require('path');
let addonPath = '';
if(process.env.PORTABLE_EXECUTABLE_DIR) {
    addonPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, './openvr.node');
} else {
    addonPath = './build/Release/openvr';
}

const openvr = require(addonPath);


export default {
    initOpenvr: () => {
        openvr.init();
    },

    shutdown:() => {
        openvr.shutdown();
    }

}
