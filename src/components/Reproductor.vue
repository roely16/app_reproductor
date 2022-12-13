<template>
        <div style="position: absolute; width: 100%; height: 100%">

            <b-container fluid>
                <b-row align-v="center">
                    <b-col cols="12">
                        <p class="overlay_top" v-if="video">
                            <strong>
                                {{ video.LUGAR }}
                            </strong>
                            <br>
                            <strong>
                                {{ video.DESCRIPCION }}
                            </strong>
                        </p>
                    </b-col>
                    <!-- <b-col cols="2">
                        <b-img v-if="video" src="./img/icono_ave.png" style="z-index:1; position:absolute; width: 2rem" fluid alt="Responsive image"></b-img>
                    </b-col> -->
                </b-row>
            </b-container>

            <video muted loop ref="player" >
                <source :src="url" type="video/mp4">
            </video>
            
            <!-- <b-container  fluid>
                <b-row>
                    <b-col cols="4">
                        <b-img v-if="video" src="./img/icono_ave.png" style="z-index:1; position:absolute; width: 2rem" fluid alt="Responsive image"></b-img>
                    </b-col>
                </b-row>
            </b-container> -->
            <!-- <p class="overlay" v-if="video">
                <strong>
                    {{ video.DESCRIPCION }}
                </strong>
            </p> -->

                    <b-img v-if="video" class="overlay" src="./img/logo_c4.jpeg" style="width: 2rem; bottom: 2%" fluid alt="Responsive image"></b-img>
                
                    <b-img v-if="video" class="overlay" src="./img/logo_muni_circulo.png" style="width: 2rem; margin-left: 42%" fluid alt="Responsive image"></b-img>

                    <b-img v-if="video" class="overlay" src="./img/ave_logo_fondo.png" style="width: 2rem; margin-left: 85%; bottom: 4%" fluid alt="Responsive image"></b-img>
            
        </div>
</template>

<style scoped>
    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* -o-object-fit: cover;
            object-fit: cover; */
        -o-object-position: center;
            object-position: center;
    }
    .overlay {
        position:absolute;
        bottom: 0;
        left: 2%;
        z-index:1;
        color:white;
        /* background-color: black; */
        margin: 0;
        padding: 0;
        font-size: 0.88rem;
        /* background-color: rgba(63, 127, 191, 0.8); */
        width: 95%
    }
    .overlay_top {
        position:absolute;
        top: 2%;
        left: 1%;
        z-index:1;
        color:white;
        /* background-color: black; */
        margin: 0;
        padding: 0;
        font-size: 0.7rem;
        background-color: rgba(63, 127, 191, 0.5);
        width: 98%
    }
</style>


<script>

    import MarqueeText from 'vue-marquee-text-component'

    import io from 'socket.io-client';

    export default {
        components: {
            // eslint-disable-next-line vue/no-unused-components
            MarqueeText
        },
        props: {
            id: Number
        },
        data(){
            return{
                socket : io('http://udicat.muniguate.com:3000'),
                player:  null,
                url: '',
                video: null
            }
        },
        methods: {
            
        },
        mounted(){

            // eslint-disable-next-line no-unused-vars
            // this.socket.on('connect', function (data) {
                
            // });

            this.socket.emit('storeClientInfo', { customId: this.id });

            this.player = this.$refs.player

            this.socket.on('play', (data) => {
				this.player.play()
				// eslint-disable-next-line no-console
				console.log(data)
            })
            
            this.socket.on('stop', (data) => {
				this.player.pause()
				this.player.currentTime = 0;
				// eslint-disable-next-line no-console
				console.log(data)
			})

			this.socket.on('pause', (data) => {
				this.player.pause()
				// eslint-disable-next-line no-console
				console.log(data)
            })
            
            this.socket.on('play_video', (data) => {
				// this.player.pause()
				// eslint-disable-next-line no-console
				this.url = 'http://udicat.muniguate.com/' + data.url
                this.video = data.video

				// eslint-disable-next-line no-console
				console.log(this.url)

				this.player.load()
				this.player.play()

            })
            
            this.socket.on('fullscreen', (data) => {
				// this.player.pause()
				// eslint-disable-next-line no-console

                if (!window.fullScreen) {
                    if (this.player.requestFullscreen) {
                        this.player.requestFullscreen();
                    } else if (this.player.mozRequestFullScreen) { /* Firefox */
                        this.player.mozRequestFullScreen();
                    } else if (this.player.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                        this.player.webkitRequestFullscreen();
                    } else if (this.player.msRequestFullscreen) { /* IE/Edge */
                        this.player.msRequestFullscreen();
                    }
                }else{

                    // eslint-disable-next-line no-console
                    console.log('exit')

                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }

                }
				
				// eslint-disable-next-line no-console
				console.log(data)
			})
        }
    }
</script>