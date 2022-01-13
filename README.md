
# OpenGloves UI [![Steam Badge]][Steam] [![Discord Badge]][Discord]

*This repository is the user interface of the* ***[OpenGloves]*** *OpenVR driver.*



*While this* ***UI*** *is not required, it is strongly* <br>
*recommended for use with our driver.*

---

**⸢ [Installation] ⸥ ⸢ [Building] ⸥**

---

Written in **Svelte** & **Tauri**.

---

## Settings

This interface fetches the `default.vrsettings` <br>
and afterwards the **OpenVR** user configuration.

The default config is located relative to `src-tauri` <br>
at `../resources/settings/default.vrsettings`.

The default configuration is for default settings only, <br>
**OpenVR** driver will not check this file, instead they <br>
search in the `steamvr.vrsettings` config.

---

## Contributions

**Pull requests are very welcome.**

*For major changes, please open* <br>
*an* ***[Issue]*** *first to discuss what* <br>
*would like to change.*




<!----------------------------------------------------------------------------->

[Steam Badge]: https://img.shields.io/badge/Steam-000000?style=for-the-badge&logo=steam&logoColor=white
[Discord Badge]: https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white

[Discord]: https://discord.gg/lucidvr
[Steam]: https://store.steampowered.com/app/1574050/OpenGloves

[OpenGloves]: https://github.com/LucidVR/opengloves-driver


[Installation]: docs/Installation.md
[Building]: docs/Building.md

[Issue]: https://github.com/LucidVR/opengloves-ui/issues
