<template>
  <div id="app">
    <router-view class="main-content"/>
  </div>
</template>

<script>
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export default {
  name: 'App',
}
</script>
