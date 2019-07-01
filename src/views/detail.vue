<template>
  <div id="detail">id: {{id}}</div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  }
};
</script>

