<template>
    <div>
        <app-nav></app-nav>
        <br>
        <br>
        <br>
        <br>
        <br>
        <b-container fluid class="py-5">
            <b-row>
                <b-col></b-col>
                <b-col cols="8">
                    <b-card  bg-variant="dark" text-variant="white" title="">
                        <p class="card-text">
                        <h2>400 Bad Request</h2>
                        </p>
                        <br>
                        <p>Your browser sent a request that this server could not understand.</p>
                    </b-card>
                </b-col>
                <b-col></b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>  
    import AppNav from './AppNav.vue'  
      export default {
        components: {        
          'app-nav': AppNav
        },
    }
</script>
<style scoped>
</style>
<!-- End-Of-File -->