<template>
    <div style="background-color: black">
        <b-row style="margin-left: 0px; margin-right: 0px">
            <b-col cols="3" v-for="index in 16" :key="index" style="height: 25vh; border: 1px solid #fff; padding-left: 0px; padding-right: 0px">
                <Reproductor :id="index" />
            </b-col>
        </b-row>
       
    </div>
</template>

<script>

    import Reproductor from '@/components/Reproductor.vue'

    export default {
        components: {
            // eslint-disable-next-line vue/no-unused-components
            Reproductor
        },
        data(){
            return{
                number_players: 16,
                players: []
            }
        },
        methods: {
            crear_grid(){

                for (let index = 0; index < this.number_players; index++) {

                   let player = {
                       id: index + 1
                   }

                   this.players.push(player);
                   
                }

            }
        },
        mounted(){
            this.crear_grid()
        }   
    }
</script>