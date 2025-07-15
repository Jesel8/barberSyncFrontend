<!-- src/routes/+layout.svelte -->
<script>
    import { onMount } from 'svelte';
    import { authStore } from '$lib/stores/authStore.js';

    // Este onMount se ejecutará una sola vez cuando la aplicación cargue por primera vez.
    onMount(() => {
        console.log("🚀 Layout principal montado. Inicializando authStore...");
        authStore.init();
    });
</script>

<!-- El <slot /> representa el contenido de la página actual. -->
<slot />

<!-- Aquí puedes tener tu navbar o footer si son compartidos en toda la app -->