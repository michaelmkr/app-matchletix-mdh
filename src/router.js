import Vue from 'vue';
import Router from 'vue-router';

import Lunges from "./components/videos/Lunges";
import Training from "./components/Training";
import Squats from "./components/videos/Squats";
import SquatJumps from "./components/videos/SquatJumps";
import Shuffle from "./components/videos/Shuffle";
import TrainingAlone from "./components/TrainingAlone";

Vue.use(Router);

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Training,
        },
        {
            path: '/lunges',
            name: 'lunges',
            component: Lunges,
        },
        {
            path: '/squats',
            name: 'squats',
            component: Squats,
        },
        {
            path: '/squatjump',
            name: 'squatjump',
            component: SquatJumps,
        },
        {
            path: '/shuffle',
            name: 'shuffle',
            component: Shuffle,
        },
        {
            path: '/alone',
            name: 'alone',
            component: TrainingAlone,
        },
    ],
});
