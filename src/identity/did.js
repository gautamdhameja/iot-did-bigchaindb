import * as driver from 'bigchaindb-driver' // eslint-disable-line
import clone from 'clone'
import { userDidTemplate, thingDidTemplate } from './didTemplate'

export default function createDid(didType = '') {
    // TODO: Find a better way to add id in DDO for BDB
    // For now, skipping the id property and usingB BDB asset id instead
    // ddo.id = did

    let ddo
    if (didType === 'user') {
        ddo = clone(userDidTemplate)
    } else if (didType === 'thing') {
        ddo = clone(thingDidTemplate)
    } else {
        throw new Error('Invalid type passed')
    }

    const keyPair = new driver.Ed25519Keypair()

    ddo.owner[0].publicKeyBase58 = keyPair.publicKey
    ddo.owner[0].expires = (_getKeyExpiry()).toISOString()
    ddo.created = (new Date()).toISOString()
    ddo.updated = (new Date()).toISOString()

    return {
        'ddo': ddo,
        'keypair': keyPair
    }
}

function _getKeyExpiry(years = 1) {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()
    const yearsFromToday = new Date(year + years, month, day)
    return yearsFromToday
}
