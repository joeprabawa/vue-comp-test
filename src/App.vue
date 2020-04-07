<template>
  <v-app>
    <v-container>
      <v-content>
        <!-- <v-row>
          <v-col
            v-for="(icon, i) in icons"
            :key="i"
            class="d-flex flex-column align-center justify-center"
          >
            <v-btn class="blue-grey darken-4" fab large depressed>
              <v-icon color="yellow lighten-3">{{ icon.name }}</v-icon>
            </v-btn>
            <span class="caption mt-2">{{ icon.span }}</span>
          </v-col>
        </v-row>-->
        <Home />
      </v-content>
    </v-container>
    <v-bottom-navigation app v-model="bottomNav" grow :color="color">
      <v-btn>
        <span>Votes</span>
        <v-icon>mdi-vote</v-icon>
      </v-btn>

      <v-btn v-if="!user" @click="login">
        <span>Login</span>
        <v-icon>mdi-lock-open-outline</v-icon>
      </v-btn>
      <v-btn v-else @click="logout">
        <span>Logout</span>
        <v-icon>mdi-lock-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-snackbar v-model="snackbar.display" top right>
      <v-icon
        dark
        left
        :color=" snackbar.types !== 'warning'  ? 'green lighten-1' : 'yellow darken-1'"
      >
        {{
        snackbar.types !== 'warning' ? "mdi-checkbox-marked-circle" : "mdi-close-circle"
        }}
      </v-icon>
      {{ snackbar.msg }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Home from "./views/Home.vue";
import {
  defineComponent,
  ref,
  computed,
  onMounted
} from "@vue/composition-api";
import { actions, state } from "./store";

export default defineComponent({
  name: "App",
  components: {
    Home
  },

  setup() {
    const bottomNav = ref<number>(3);
    const icons = [
      {
        name: "mdi-album",
        span: "Album",
        color: "indigo"
      },
      {
        name: "mdi-history",
        span: "History",
        color: "green"
      },
      {
        name: "mdi-movie-outline",
        span: "Movies",
        color: "amber"
      },
      {
        name: "mdi-chart-donut",
        span: "Statistic",
        color: "purple"
      }
    ];
    const color = computed(() => {
      {
        switch (bottomNav.value) {
          case 0:
            return "teal";
          case 1:
            return "indigo";
        }
      }
    });

    onMounted(() => {
      actions.authState();
    });

    return {
      ...state,
      ...actions,
      icons,
      bottomNav,
      color
    };
  }
});
</script>
