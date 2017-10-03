import _log from '../../utils/logger'

const log = _log(module)

export default function (raw) {
    const payload = {}

    payload.asset = {
        ns: 'bdb.did.message',
        schema: 'http://schema.bdb.thing.message'
    }

    payload.metadata = {
        _data: raw
    }

    log.debug(payload)
    return payload
}
