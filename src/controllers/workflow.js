import getConnection from '../connections/getConnection'
import _log from '../utils/logger'

const log = _log(module)

export default async function Workflow(asset, metadata, optionalLedgers = []) {
    const result = []

    // create bdb object
    const bdbConnection = getConnection('bdb', {})

    // foreach optionalLedgers create object
    const optionalLedgerConnections = getLedgerConnections(optionalLedgers)

    // createTransaction for bdb
    let bdbTx = await bdbConnection.createTransaction(asset, metadata)

    // createTransaction for each optionalLedger => result
    await Promise.all(optionalLedgerConnections.map(async (ledger) => {
        const tx = await ledger.createTransaction(metadata, null)
        if (tx !== '') {
            result.push({ 'ledger': ledger.name, 'id': tx })
            log.debug(result)
        }
    }))

    if (result.length > 0) {
        // from values in result update bdb transaction
        metadata._links = result
        log.debug(metadata)
        log.debug('starting update bdb tx')
        bdbTx = await bdbConnection.updateTransaction(bdbTx, metadata)
    }

    log.info(bdbTx)
    return bdbTx.id
}

function getLedgerConnections(optionalLedgers) {
    log.debug(optionalLedgers)
    const optionalLedgerInstances = []
    if (optionalLedgers.includes('bdb')) {
        const index = optionalLedgers.indexOf('bdb')
        optionalLedgers.splice(index, 1)
        log.debug('removed bdb from optional ledgers')
        log.debug(optionalLedgers)
    }
    optionalLedgers.forEach((element) => {
        optionalLedgerInstances.push(getConnection(element, {}))
    })
    return optionalLedgerInstances
}

