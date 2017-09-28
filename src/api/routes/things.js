import Router from 'koa-router'
import workflow from '../../controllers/workflow'
import _log from '../../utils/logger'
import requestParser from '../requestParsers/thingsParser'

const log = _log(module)

const router = new Router({
    prefix: '/things'
})

/**
 * @api {post} /things/ Register Device
 * @apiVersion 1.0.0
 * @apiPermission user
 * @apiName RegisterDevice
 * @apiGroup Things
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *
 *     }
 *
 * @apiUse TokenError
 */
router.post('/', async (ctx) => {
    const qs = ctx.request.query
    const body = ctx.request.body

    // get optional ledgers
    let optionalLedgers
    if (qs.ledger) {
        optionalLedgers = qs.ledger.split(',')
    }

    // get message type, if specified
    let thingType = ''
    if (qs.type) {
        thingType = qs.type
    }

    let result = {}
    try {
        log.debug('parsing request')
        // parse request body as per oem and message type
        const payload = requestParser(body, thingType)

        log.debug('starting transaction workflow')

        // invoke workflow with all ledgers
        result = await workflow(payload.asset, payload.metadata, optionalLedgers)

        log.debug('transaction workflow completed')
        ctx.body = result
        ctx.status = 200
    } catch (error) {
        log.error(error)
        ctx.body = error.message
        ctx.status = 500
    }
})

export default router
