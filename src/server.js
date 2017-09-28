import Koa from 'koa'
import logger from 'koa-logger'
import mount from 'koa-mount'
import api from './api'
import middleware from './middleware'
import config from './config'

const app = new Koa()
if (config.environment === 'development') {
    app.use(logger())
}
app.use(middleware())
app.use(mount(api))

export default app
