<script>
    import Link from './Link.svelte';
    import {faDiscord, faGithub} from '@fortawesome/free-brands-svg-icons';
    import Fa from "svelte-fa";
    import ToolTip from "./ToolTip.svelte";
</script>

<footer class="p-4 text-center flex flex-row items-center space-x-3">
    <ToolTip text="View the source code">

    <Link url="https://github.com/LucidVR/opengloves-ui" colour="black">
        <Fa icon={faGithub} size="2x"/>
    </Link>
    </ToolTip>
    <ToolTip text="Join our discord server">
        <Link url="https://discord.gg/favJqS2k4X" colour="blue">
            <Fa icon={faDiscord} size="2x"/>
        </Link>
    </ToolTip>

</footer>