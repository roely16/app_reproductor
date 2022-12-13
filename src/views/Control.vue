<template>
    <div>
        <b-container fluid>
            <b-row class="mt-4">
                <b-col cols="12">
                    <b-card bg-variant="dark" text-variant="white">
                        <b-row>

                            <b-col class="mt-2" cols="3" v-for="(data, key) in players" :key="key">    
                                <!-- <Control_Reproductor :id="key + 1" /> -->
                                <b-card :bg-variant="data.color" text-variant="white">
                                    <h4>ID: {{ data.clientID }}</h4>
                                    <b-row>
                                        <b-col cols="8">
                                           
                                            <font-awesome-icon icon="play" @click="play(data)"/>
                                            
                                            <font-awesome-icon class="ml-2" icon="pause" @click="pause(data)"/>

                                            <font-awesome-icon class="ml-2" icon="stop"  @click="stop(data)" />

                                        </b-col>
                                        <b-col cols="4" class="text-right">
                                            <font-awesome-icon class="ml-2" icon="info-circle" @click="show_detail(data)" v-if="data.video" />
                                        </b-col>
                                    </b-row>
                                </b-card>
                            </b-col>      
                        </b-row>
                    </b-card>
                </b-col>
            </b-row>
            
            <b-row class="mt-4">
                <b-col cols="4">
                    <b-input-group>
                        <template v-slot:append>
                            <b-input-group-text>
                                <font-awesome-icon icon="search" />
                            </b-input-group-text>
                        </template>
                        <b-form-input autocomplete="off" v-model="busqueda"></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col cols="4" class="text-center">
                    <b-button variant="danger" @click="restablecer">
                        RESTABLECER 
                        <font-awesome-icon icon="exclamation-triangle" />
                    </b-button>
                </b-col>
                <b-col cols="2">

                </b-col>
                <b-col cols="2" class="text-right">
                    <b-button :disabled="loading" variant="info" @click="obtener_videos()">
                        <font-awesome-icon v-if="!loading" icon="sync-alt" />
                        <b-spinner v-if="loading" small></b-spinner>
                        <span v-if="loading" class="sr-only">Loading...</span>
                    </b-button>
                </b-col>
            </b-row>

            <b-row class="mt-4">
                <b-col cols="12">
                    <b-table show-empty empty-filtered-text="No se encontraron registros que coincidan con su búsqueda" empty-text="No existen registros para mostrar" small striped hover :items="videos" :fields="fields" :per-page="perPage" :current-page="currentPage" :filter="busqueda" :tbody-tr-class="rowClass">

                        <template v-slot:cell(action)="video">
                            <b-dropdown size="sm" class="m-md-2">
                                <template v-slot:button-content>
                                    <font-awesome-icon icon="share" />
                                </template>
                                <b-dropdown-item v-for="(data, key) in players" :key="key"  @click="send_video(video.item, data)">{{ data.clientID }}</b-dropdown-item>
                            </b-dropdown>
                        </template>

                        <template v-slot:cell(status)="data">
                            <b-button class="m-md-2" v-if="data.item.STATUS" size="sm" :variant="data.item.COLOR_STATUS">
                                <font-awesome-icon icon="video" />
                            </b-button>
                        </template>

                        <template v-slot:cell(status)="row" >
                            <b-button size="sm" @click="row.toggleDetails" class="m-md-2" variant="primary" v-if="row.item.PLAYERS.length > 0">
                                <font-awesome-icon icon="video" />
                            </b-button>
                        </template>

                        <!-- Detalle de Reproductores -->
                        <template v-slot:row-details="row">
                            <b-card>
                                <b-row class="mb-2">
                                    <b-col sm="3" class="text-sm-right"><b>Reproductores:</b></b-col>
                                    <ul>
                                        <li v-for="(player, index) in row.item.PLAYERS" :key="index">ID: {{ player.cliendID }}</li>
                                    </ul>
                                </b-row>

                                <b-button size="sm" @click="row.toggleDetails">Ocultar Reproductores</b-button>
                            </b-card>
                        </template>

                    </b-table>
                </b-col>
                <b-col cols="12" >
                    <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    aria-controls="my-table"
                    align="center"
                    ></b-pagination>
                </b-col>
            </b-row>

        </b-container>

        <b-modal id="modal-1" ref="my-modal" size="xl" title="Detalle de Video" hide-footer>
            <b-row align-v="start">
                <b-col cols="6">
                    <b-row>
                        <b-col cols="12">
                            <b-form-group id="input-group-1" label="Tipo de Inmueble" label-for="input-1">
                                <h5>{{ detail_current_video.INMUEBLE }}</h5>
                            </b-form-group>
                        </b-col>
                        <b-col cols="12">
                            <b-form-group id="input-group-1" label="Lugar" label-for="input-1">
                                <h5>{{ detail_current_video.LUGAR }}</h5>
                            </b-form-group>
                        </b-col>
                        <b-col cols="12">
                            <b-form-group id="input-group-1" label="Zona" label-for="input-1">
                                <h5>{{ detail_current_video.ZONA }}</h5>
                            </b-form-group>
                        </b-col>
                        <b-col cols="12">
                            <b-form-group id="input-group-1" label="Descripción" label-for="input-1">
                                <h5>{{ detail_current_video.DESCRIPCION }}</h5>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col>
                    <b-row>
                        <b-col cols="12">
                            <video width="520" height="340" controls>
                                <source :src="'https://udicat.muniguate.com/' + detail_current_video.URL" type="video/mp4">
                            </video>
                        </b-col>
                        <b-col cols="12">
                            
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>

            
        </b-modal>

        <!-- Toast -->

        <b-toast id="my-toast" variant="warning" solid>
            <template v-slot:toast-title>
                <div class="d-flex flex-grow-1 align-items-baseline">
                <b-img blank blank-color="#ff5555" class="mr-2" width="12" height="12"></b-img>
                <strong class="mr-auto">Notice!</strong>
                <small class="text-muted mr-2">42 seconds ago</small>
                </div>
            </template>
            This is the content of the toast.
            It is short and to the point.
        </b-toast>

    </div>    
</template>

<script>

    import io from 'socket.io-client';

    export default {
        data(){
            return{
                currentPage: 1,
                rows: null,
                perPage: 5,
                socket: io('http://udicat.muniguate.com:3000'),
                reproductores: [],
                detail_current_video: {},
                videos: [],
                current_players: JSON.parse(localStorage.getItem('reproductores')),
                items: [
                    { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
                    { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
                    { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
                    { age: 38, first_name: 'Jami', last_name: 'Carney' }
                ],
                fields: [
                    {
                        key: 'ID',
                        label: 'ID',
                        sortable: true
                    },
                    {
                        key: 'LUGAR',
                        label: 'Lugar',
                        sortable: true
                    },
                    {
                        key: 'ZONA',
                        label: 'Zona',
                        sortable: true
                    },
                    {
                        key: 'INMUEBLE',
                        label: 'Tipo',
                        sortable: true
                    },
                    {
                        key: 'DESCRIPCION',
                        label: 'Descripción',
                        sortable: false
                    },
                    {
                        key: 'status',
                        label: 'Estado',
                        sortable: false,
                        class: "text-center"
                    },
                    {
                        key: 'action',
                        label: 'Acción',
                        sortable: false,
                        class: "text-right"
                    }
                ],
                busqueda: '',
                loading: false,
                isMounted: false

            }
        },
        mounted(){

            this.isMounted = true

            this.obtener_videos()

            this.$nextTick(function () {
                
                window.setInterval(() => {
                    
                    this.obtener_videos()

                },5000);
            
            })
            

            // if (this.reproductores.length <= 0) {
                    
            //     this.reproductores =  JSON.parse(localStorage.getItem('reproductores'))

            // }

            let local_reproductores = JSON.parse(localStorage.getItem('reproductores'))

            if (local_reproductores) {
                
                this.reproductores = JSON.parse(localStorage.getItem('reproductores'))
                
            }

            //this.reproductores = JSON.parse(localStorage.getItem('reproductores'))

            this.socket.on('control', (data) => {
				// eslint-disable-next-line no-console
                console.log(data)
                
                if (data.type == 'connect') {
                    
                    this.reproductores.push(data)

                    localStorage.setItem('reproductores', JSON.stringify(this.reproductores.sort((t1, t2) => t1.clientID < t2.clientID ? -1 : 1)))
                
                }else if(data.type == 'disconnect'){
                    
                    let filter_reproductores = this.reproductores.filter(item => item.value != data.value)

                    this.reproductores = filter_reproductores

                    localStorage.setItem('reproductores', JSON.stringify(this.reproductores.sort((t1, t2) => t1.clientID < t2.clientID ? -1 : 1)))

                }
            })
            

        },
        methods: {
            play(data){

                // Solo si tiene cargado un video 

                if (data.color != 'secondary') {
                    
                    this.socket.emit('play', {
                        id: data.value
                    });
                    // eslint-disable-next-line no-console
                    console.log(data)

                    data.color = 'primary'

                    localStorage.setItem('reproductores', JSON.stringify(this.reproductores))

                }else{

                    this.error_message()

                }

            },
            pause(data){

                if (data.color != 'secondary') {

                    this.socket.emit('pause', {
                        id: data.value
                    });

                    data.color = 'warning'

                    localStorage.setItem('reproductores', JSON.stringify(this.reproductores))

                }else{

                    this.error_message()

                }
                
            },
            stop(data){

                if (data.color != 'secondary') {

                    this.socket.emit('stop', {
                        id: data.value
                    });

                    data.color = 'danger'

                    // eslint-disable-next-line no-console
                    console.log(this.reproductores)

                    localStorage.setItem('reproductores', JSON.stringify(this.reproductores))

                }else{

                    this.error_message()

                }
                
            },
            // eslint-disable-next-line no-unused-vars
            send_video(video, player){

                video.STATUS = 'play'
                video.COLOR_STATUS = 'primary'

                let player_ = {
                    type: player.type,
                    value: player.value,
                    color: player.color,
                    cliendID: player.clientID
                }

                /* Buscar si en otro video no esta el mismo reproductor */
                this.videos.forEach(element => {
        
                    if (element.PLAYERS.length > 0) {

                        let result = element.PLAYERS.filter(play => play.cliendID != player.clientID)
                        
                        element.PLAYERS = result
                    }

                });

                video.PLAYERS.push(player_)

                let data = {
                    url: video.URL,
                    id: player.value,
                    video: video
                }

                this.socket.emit('play_video', data);

                player.color = 'primary'
                player.video = video
                this.detail_current_video = video

                // Video
                video.ESTADO = 'Reproduciento (' + player.clientID + ')' 

                localStorage.setItem('reproductores', JSON.stringify(this.reproductores))
                localStorage.setItem('videos', JSON.stringify(this.videos))

            },
            obtener_videos(){

                this.loading = true
                
                if (JSON.parse(localStorage.getItem('videos')) != null) {
                    
                    this.videos = JSON.parse(localStorage.getItem('videos'))

                }else{

                    this.videos = []

                }

                

                this.axios.get(process.env.VUE_APP_API_VIDEOS).then((response) => {
                    // eslint-disable-next-line no-console
                    // console.log(response.data)

                    /* Validar si existe un  nuevo video */
                    // eslint-disable-next-line no-unused-vars
                    response.data.forEach(element => {
                        
                        let found = false

                        // eslint-disable-next-line no-unused-vars
                        this.videos.forEach(video => {

                            // eslint-disable-next-line no-console

                            if (element.ID == video.ID) {
                                
                               found = true

                            }

                        })

                        if (!found) {
                            
                            // eslint-disable-next-line no-console
                            console.log('mostrar alerta')
                            

                            // Mostrar alerta
                            if (!this.isMounted) {
                                
                                this.videos.unshift(element)
                                this.mostrarNotificacion(element)

                            }else{

                                this.videos.push(element)

                            }

                        }

                    });

                    // Registrar en localStorage
                    localStorage.setItem('videos', JSON.stringify(this.videos))

                    // this.videos = response.data
                    this.rows = this.videos.length
                    // eslint-disable-next-line no-console
                    console.log(this.videos)
                    this.loading = false
                    this.isMounted = false
                })
            },
            fullscreen(data){
                this.socket.emit('fullscreen', {
                    id: data.value
                });
            },
            error_message(){

                // eslint-disable-next-line no-undef
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debe primero enviar un video al reproductor!',
                })

            },
            show_detail(player){

                // eslint-disable-next-line no-console
                console.log(player)

                this.detail_current_video = player.video
                this.$refs['my-modal'].show()

            },
            rowClass(item, type) {
                if (!item || type !== 'row') return
                if (item.PLAYERS.length > 0) return 'table-success'
            },
            mostrarNotificacion(element){

                // eslint-disable-next-line no-console
                console.log(element)

                this.$bvToast.toast('Se ha agregado un nuevo video de ' + element.LUGAR, {
                    title: 'Nuevo Video',
                    variant: 'primary',
                    solid: true
                })

            },
            restablecer(){

                // eslint-disable-next-line no-undef
                Swal.fire({
                    title: '¿Está seguro?',
                    text: "Sera eliminado el estado actual de reproductor!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Si, RESTABLECER!'
                }).then((result) => {

                    if (result.value) {

                       localStorage.removeItem('reproductores')
                        localStorage.removeItem('videos')
                        location.reload()

                        // eslint-disable-next-line no-undef
                        Swal.fire(
                            'Excelente!',
                            'El reproductor ha sido restablecido.',
                            'success'
                        )
                    }

                })

                

            }
        },
        computed: {
            // eslint-disable-next-line vue/return-in-computed-property
            players: function(){

                // eslint-disable-next-line no-console

                if (this.reproductores.length <= 0) {
                    
                    return JSON.parse(localStorage.getItem('reproductores'))

                }else{

                    // eslint-disable-next-line no-unused-vars

                    return this.reproductores
                }

            }
        }
        
    }
</script>