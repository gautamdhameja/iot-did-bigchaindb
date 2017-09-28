import Router from 'koa-router'
import workflow from '../../controllers/workflow'
import _log from '../../utils/logger'
import requestParser from '../requestParsers/messagesParser'

const log = _log(module)

const router = new Router({
    prefix: '/messages'
})

/**
 * @api {post} /messages/ 
 * @apiVersion 1.0.0
 * @apiPermission user
 * @apiName POST Message
 * @apiGroup Messages
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
    let messageType = ''
    if (qs.type) {
        messageType = qs.type
    }

    const result = []
    try {
        log.debug('parsing request')
        // parse request body as per oem and message type
        const payloads = await requestParser(body, messageType)
        log.debug(payloads)

        log.debug('starting transaction workflow')

        // invoke workflow with all ledgers    
        await Promise.all(payloads.map(async (payload) => {
            const tx = await workflow(payload.asset, payload.metadata, optionalLedgers)
            result.push(tx)
        }))

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
