import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";

import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import { ref } from "@vue/composition-api";
import { Artist, User } from "./interface";
import { firebaseConfig as config } from "./dbconfig";

Vue.use(VueCompositionApi);
firebase.initializeApp(config);

export const state = {
  artists: ref<Artist[]>([]),
  loading: ref<boolean>(true),
  user: ref<User | null>(null),
  snackbar: ref<object>({}),
};

const db = firebase.firestore();

export const actions = {
  getArtists: () => {
    const paths = db.collection("artists");
    paths.onSnapshot((snaps) => {
      const dataArtist: Artist[] = [];
      snaps.forEach((snap) => {
        dataArtist.push(snap.data() as Artist);
      });
      return (state.artists.value = dataArtist);
    });
    state.loading.value = false;
  },

  login: async (): Promise<User> => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const signin = await firebase.auth().signInWithPopup(provider);
    const user: User = signin.user as User;

    const newUser: User = {
      uid: user?.uid,
      email: user?.email,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
    };
    const userRef = db.collection("users").doc(user?.uid);
    await userRef.set(newUser);
    return (state.user.value = newUser);
  },

  logout: async (): Promise<void> => {
    try {
      const signOut = await firebase.auth().signOut();
      state.snackbar.value = {
        types: "warning",
        display: true,
        msg: "You Need To Login",
      };
      state.user.value = null;
      return signOut;
    } catch (err) {
      return err;
    }
  },

  authState: () => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        state.snackbar.value = {
          types: "success",
          display: true,
          msg: "Welcome Back",
        };
        return (state.user.value = { uid, displayName, email, photoURL });
      } else {
        state.snackbar.value = {
          types: "warning",
          display: true,
          msg: "You Need To Login",
        };
        return (state.user.value = null);
      }
    });
  },

  onVotes: async (artistID: string) => {
    if (!state.user.value?.uid) {
      state.snackbar.value = {
        types: "warning",
        display: true,
        msg: "Please Login to Votes",
      };
      return;
    }

    const artistPath = db.collection("artists").doc(artistID);
    const artistDoc = await artistPath.get();
    const artistData = artistDoc.data();
    const votes = artistData?.votedBy;

    const multiple = state?.artists?.value.filter((v) =>
      v.votedBy?.find((val) => val.uid === state.user.value?.uid)
    );

    if (multiple.length > 2) {
      state.snackbar.value = {
        display: true,
        types: "warning",
        msg: "Maximum 3 Artists to Votes",
      };
    } else if (!votes.find((val: User) => val?.uid === state.user.value?.uid)) {
      artistPath.update({
        votedBy: [...votes, state.user.value],
      });
    } else {
      state.snackbar.value = {
        display: true,
        types: "warning",
        msg: "Alredy Vote This Artist",
      };
    }
  },
};
