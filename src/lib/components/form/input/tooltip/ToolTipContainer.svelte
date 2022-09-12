<script lang="ts">
	import Fa from 'svelte-fa';
	import ToolTip from './ToolTip.svelte';
	import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

	export let description: string;
</script>

<div class="px-2">
	<ToolTip text={description}>
		<Fa icon={faQuestionCircle} color="grey" />
	</ToolTip>
</div>
