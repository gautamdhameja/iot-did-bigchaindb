import Ajv from 'ajv'
import uuidv1 from 'uuid/v1'
import clone from 'clone'
import _log from '../utils/logger'
import didSchema from './didSchema'
import didTemplate from './didTemplate'

const log = _log(module)
const ajv = new Ajv()

export function create() {
    const uniqueid = uuidv1().toString()
    const did = `did:bdb:${uniqueid}`

    const ddo = clone(didTemplate)
    ddo.id = did
    ddo.owner[0].id = did
    ddo.created = (new Date()).toISOString()
    ddo.updated = (new Date()).toISOString()

    return ddo
}

export function validate(raw) {
    const schema = ajv.compile(didSchema)
    const isValid = schema(raw)
    if (!isValid) {
        log.error(schema.errors)
    }

    return isValid
}
