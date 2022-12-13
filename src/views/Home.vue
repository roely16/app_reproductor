<template>
	<div class="home" style="background-color:black;">
		
		<video muted style="height: 90vh;" width="100%" ref="player">
			<source :src="url" type="video/mp4">
		</video>
	</div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

	import io from 'socket.io-client';

	export default {
		name: 'home',
		data(){
			return{
				socket : io('http://localhost:3000/'),
				player:  null,
				url: ''
			}
		},
		mounted(){

			this.player = this.$refs.player

			this.socket.on('chat message', (data) => {
				// eslint-disable-next-line no-console
				console.log(data)
			})

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
				this.url = 'https://udicat.muniguate.com/' + data.url

				// eslint-disable-next-line no-console
				console.log(this.url)

				this.player.load()
				this.player.play()

			})

			this.socket.on('fullscreen', (data) => {
				// this.player.pause()
				// eslint-disable-next-line no-console

				if (this.player.requestFullscreen) {
					this.player.requestFullscreen();
				} else if (this.player.mozRequestFullScreen) { /* Firefox */
					this.player.mozRequestFullScreen();
				} else if (this.player.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
					this.player.webkitRequestFullscreen();
				} else if (this.player.msRequestFullscreen) { /* IE/Edge */
					this.player.msRequestFullscreen();
				}
				// eslint-disable-next-line no-console
				console.log(data)
			})
		}
		
	}
	</script>
