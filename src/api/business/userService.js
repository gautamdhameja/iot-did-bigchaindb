import _log from '../../utils/logger'
import createDid from '../../identity/did'

const log = _log(module)

export default function (raw) {
    const payload = {}

    const userDdo = createDid('user')

    payload.asset = {
        ns: 'bdb.did.user',
        schema: 'http://schema.bdb.did.user'
    }

    payload.metadata = {
        _data: raw,
        _ddo: userDdo.ddo
    }

    payload.identity = {
        keys: userDdo.keypair
    }

    log.debug(payload)
    return payload
}
