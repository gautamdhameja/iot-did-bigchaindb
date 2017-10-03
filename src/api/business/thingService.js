import _log from '../../utils/logger'
import createDid from '../../identity/did'

const log = _log(module)

export default function (raw) {
    const payload = {}
    const thingDdo = createDid('thing')

    payload.asset = {
        ns: 'bdb.did.thing',
        schema: 'http://schema.bdb.did.thing'
    }

    payload.metadata = {
        _data: raw,
        _did: thingDdo
    }

    payload.identity = {
        keys: thingDdo.keypair
    }

    log.debug(payload)
    return payload
}

