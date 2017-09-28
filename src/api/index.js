import Koa from 'koa'
import Router from 'koa-router'
import importDir from 'import-dir'
import qs from 'koa-qs'
import oneerror from 'koa-onerror'
import xmlParser from 'koa-xml-body'
import bodyParser from 'koa-bodyparser'

const app = new Koa()

const router = new Router({
    prefix: '/api'
})

const routes = importDir('./routes')

Object.keys(routes).forEach(name => {
    const _route = routes[name]
    router.use(_route.routes())
})

app.use(xmlParser())
app.use(bodyParser())
app.use(router.routes())
qs(app, 'strict')
oneerror(app)

export default app
