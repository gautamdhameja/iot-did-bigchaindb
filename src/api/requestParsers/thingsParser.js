import _log from '../../utils/logger'
import { create } from '../../identity/did'

const log = _log(module)

export default function (raw, thingType = 'device') {
    const payload = {}
    const thingDid = create()

    payload.asset = {
        ns: '',
        schema: ''
    }

    payload.metadata = {
        _data: raw,
        _did: thingDid
    }

    log.debug(payload)
    return payload
}

