import _log from '../../utils/logger'
import { validate } from '../../identity/did'

const log = _log(module)

export default function (raw) {
    const payload = {}

    const isDidValid = validate(raw)
    if (!isDidValid) {
        throw new Error('DDO not valid.')
    }

    if (!raw['@context'] || !raw['@context'] === '') {
        throw new Error('DDO not valid: context is required')
    }

    if (!raw.id || raw.id === '') {
        throw new Error('DDO not valid: Id is required')
    }

    payload.asset = {
        ns: '',
        schema: ''
    }

    payload.metadata = {
        _did: raw
    }

    log.debug(payload)
    return payload
}
