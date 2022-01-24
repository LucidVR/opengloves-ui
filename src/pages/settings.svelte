<script>

    import SuspenseButton from "../components/Input/Button/SuspenseButton.svelte";
    import Accordion from "../components/Accordion.svelte";
    import Select from "../components/Input/Select.svelte";

    import SettingsStore from '../stores/settings';

</script>
<div class="flex-grow max-w-md my-10 w-full">
    <div class="w-full flex flex-col justify-center items-center">
        <div class="mx-10 w-full overflow-auto">
            <h2 class="mb-5 text-center text-3xl font-extrabold  ">
                Settings
            </h2>
            <div class="shadow rounded">
                <div class="px-4 pb-16 space-y-6">
                    <div>
                        <Accordion title={"UI Settings"} expanded={true} outAnimation={false}>
                            <Select label="Theme" options={[{
                                title: 'Light',
                                value: 'light',
                            },
                            {
                                title: 'Dark',
                                value: 'dark',
                            }
                            ]}
                            defaultValue={$SettingsStore[SettingsStore.SETTINGS_OPTION.UI_THEME]}
                                    onSelectItemChanged={v => {
                                        SettingsStore.setSetting(SettingsStore.SETTINGS_OPTION.UI_THEME, v);
                                    }}
                            />
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>