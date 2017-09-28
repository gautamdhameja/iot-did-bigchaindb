import BdbConnection from '../connections/bdb'
import IotaConnection from '../connections/iota'
import config from '../config'

export default function getConnection(ledgerName, options) {
    if (ledgerName === 'iota') {
        options.uri = config.iota.host
        return new IotaConnection(options)
    }

    options.uri = config.bdb.host
    return new BdbConnection(options)
}
