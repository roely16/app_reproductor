module.exports = {
    "transpileDependencies": [
      "vuetify"
    ],
    pwa: {
      name: 'My App',
      themeColor: '#000000',
      msTileColor: '#000000',
      manifestOptions: {
        "display": "fullscreen"
      }
    },
    publicPath: process.env.NODE_ENV === 'production'
    ? '/apps/app_reproductor/'
    : '/'
  }