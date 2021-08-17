# OpenGloves UI

### This repository contains the user interface for configuration of the OpenGloves OpenVR driver.  
Find it here: https://github.com/LucidVR/opengloves-driver

This interface reads the configuration keys from `default.vrsettings` specified in `../resources/settings/default.vrsettings` (relative to `src-tauri/`) to fetch the settings available (OpenVR doesn't seem to be able to do this), then fetches the user configurated settings via OpenVR. The `default.vrsettings` file is for default settings only, and an OpenVR Driver will look for settings found in the `steamvr.vrsettings` file, not the `default.vrsettings` the driver provides.


This UI is **not** required for usage of the driver but is recommended for convenience.  
Written in Svelte with Tauri.

## Installation and Usage
The UI is included in the Steam release of the driver:
https://store.steampowered.com/app/1574050/ 

Can be opened by launching the OpenGloves app in steam. 
(Keep in mind this does not launch the driver, that's launched with SteamVR)
 
 ## Contributing
Pull requests are very welcome. For major changes, please open an issue first to discuss what you would like to change.

### Building
This app uses Tauri under the hood, which requires some extra setup.  
* Refer here for how to get started with Tauri: https://tauri.studio/en/docs/getting-started/setup-windows


### Building Sidecar
The interface uses a c++ backend (sidecar) to communicate to OpenVR, and must be built for the project to run.
* In `sidecar/` make a directory `build/`
* Navigate into build, run `cmake ..`
* Open the Visual Studio project generated, build.
* Copy build artifacts (`sidecar-x86_64-pc-windows-msvc.exe` & `openvr_api.dll`) into `src-tauri/`

## Building the UI
* Install dependencies
    * `yarn install`
    
* Launch the dev server:
    * `yarn run dev`
        * This might take a while first time, but subsequent builds will be faster
    
* To build for production:
    * `yarn run build`
        * Artifacts will be built to: `src-tauri/targets/release`
            * Webview2 is required to be installed if you are distributing just the both the ui and sidecar executables
        * An installer is also located `src-tauri/targets/release/bundle-msi`
           * This will install Webview2
## Community Discord Server
https://discord.gg/lucidvr


