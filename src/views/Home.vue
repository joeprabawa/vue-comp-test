<template>
  <v-row justify="center" v-if="loading">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </v-row>
  <Cards v-else />
</template>

<script lang="ts">
import Cards from "../components/CardsArtists.vue";
import { defineComponent, onMounted } from "@vue/composition-api";
import { state, actions } from "../store";

export default defineComponent({
  components: {
    Cards
  },
  name: "Home",
  setup() {
    onMounted(async () => {
      const { getArtists } = actions;
      await getArtists();
    });

    return {
      ...state
    };
  }
});
</script>
