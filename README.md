# OpenGloves UI

### This repository contains the user interface for configuration of the OpenGloves OpenVR driver.  
Find it here: https://github.com/LucidVR/opengloves-driver

This interface edits the `default.vrsettings` file located in the driver, which is otherwise done manually.  
This UI is **not** required for usage of the driver but is recommended for convenience.  
Written in Svelte with Electron.

## Installation and Usage
The UI is included in the Steam release of the driver:
https://store.steampowered.com/app/1574050/ 

Can be opened by launching the OpenGloves app in steam. 
(Keep in mind this does not launch the driver, that's launched with SteamVR)

 __Important:__ Currently, the driver settings only update after closing and reopening SteamVR.
 
 ## Contributing
Pull requests are very welcome. For major changes, please open an issue first to discuss what you would like to change.

### Building
This app uses Tauri under the hood, which can be slightly tricky to get set up with.  
Refer here for how to get started with Tauri: https://tauri.studio/en/docs/getting-started/setup-windows

Once installed, to launch the dev server:
* `yarn run dev`
  * note: you might have to create a build folder in (`public/`)

To build:
* `yarn run build`
  * Artifacts will be built to: `src-tauri/targets/release`

## Discord
https://discord.gg/RjV9T8jN2G


