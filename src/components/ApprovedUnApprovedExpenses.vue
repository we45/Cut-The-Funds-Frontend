<template>
    <div>
      <bar-chart :data="approvedData"></bar-chart>
    </div>
</template>

<script>
  export default {
    name: 'ApprovedUnApproved',
    props: {
      approvedData: {
        type: Array,
        required: true
      }
    }
  }

</script>

<style scoped>

</style>
