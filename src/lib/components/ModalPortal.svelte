<!-- src/lib/components/ModalPortal.svelte -->
<script>
	import { onMount } from 'svelte';

	let portalTarget;

	onMount(() => {
		portalTarget = document.body;
	});
</script>

{#if portalTarget}
	<div class="modal-backdrop">
		<slot />
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.8);
		z-index: 9999;
	}
</style>
