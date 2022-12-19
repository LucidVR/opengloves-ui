# Building

The UI uses Tauri which requires these steps to install: https://tauri.studio/en/docs/get-started/intro

## Building the Application

1. Install dependencies with:

   ```sh
   npm install
   ```

2. Launch the development server with:

   ```sh
   npm run dev
   ```

   _The initial run may take a significant amount of time._

3. Build the interface with:

   ```sh
   npm run build
   ```

   **_Artifacts_** _will be placed in `src-tauri/targets/release`._ <br>
   _An_ **_Installer_** _is located in `src-tauri/targets/release/bundle-msi`_

<br>

##### Note

Using the **Installer** will automatically install `Webview2`.

If you only plan on distributing the **UI** <br>
binaries, you will have to manually install [`Webview2`].

<!----------------------------------------------------------------------------->

[some extra setup]: 
[`webview2`]: https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section
