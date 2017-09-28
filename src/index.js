import config from './config'
import app from './server'
// import initialize from './init/appInit'

(
    async () => {
        try {
            console.log('Initializing')
            // await initialize(config.bdb.host) // one time only
        } catch (ex) {
            console.error(ex)
        }

        app.listen(config.server.port, () => {
            console.log(`App started on port ${config.server.port} 
            with environment ${config.environment}`)
        })
    }
)()
