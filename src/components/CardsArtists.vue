<template>
  <div>
    <v-row justify="center">
      <v-col
        :class="$vuetify.breakpoint.smAndDown? 'px-0 pb-2':''"
        lg="4"
        md="4"
        sm="6"
        xs="12"
        v-for="artist in artists"
        :key="artist.id"
      >
        <v-card flat tile>
          <v-img
            :src="artist.images[0].url"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.3)"
            height="260px"
          >
            <v-card-title v-text="artist.name"></v-card-title>
            <v-card-subtitle class="d-flex">
              <v-chip class="mr-2 text-capitalize caption">{{ artist.genres[0] }}</v-chip>
              <v-chip color="green darken-1" text-color="white">
                <v-icon left>mdi-spotify</v-icon>
                {{ artist.popularity }}
              </v-chip>
            </v-card-subtitle>
          </v-img>

          <v-card-actions>
            <v-avatar
              style="margin-right:-10px;"
              size="30"
              v-for="(avatar, index) in avatar(artist.votedBy)"
              :key="index"
            >
              <img style="border:3px solid white;" :src="avatar.photoURL" alt="profpic" />
            </v-avatar>
            <v-chip
              small
              v-if="artist.votedBy.length > 3"
              class="caption font-weight-bold ml-4"
            >+{{ artist.votedBy.length - 4 }} Others</v-chip>

            <v-spacer></v-spacer>
            <v-btn small depressed v-if="voted(artist)">
              <v-icon small left color="success">mdi-thumb-up</v-icon>voted
            </v-btn>
            <v-btn v-else text @click="onVotes(artist.id)">
              <v-icon left>mdi-arrow-up</v-icon>
              {{ artist.votedBy.length }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { state, actions } from "../store";
import { User, Artist } from "../interface";

export default defineComponent({
  name: "Cards",
  setup() {
    const avatar = (arr: User[]) => arr.slice(0, 4);
    const voted = (artist: Artist): boolean => {
      if (state.user.value != null) {
        return artist?.votedBy.find(v => v.uid == state?.user?.value?.uid)
          ? true
          : false;
      } else {
        return false;
      }
    };

    return {
      ...state,
      ...actions,
      avatar,
      voted
    };
  }
});
</script>

<style>
</style>
