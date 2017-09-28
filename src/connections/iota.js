import IOTA from 'iota.lib.js'
import CryptoJS from 'crypto-js'
import sha256 from 'crypto-js/sha256'
import _log from '../utils/logger'
import BaseConnection from './baseConnection'

const log = _log(module)

const seed = 'QWERTY9'

// IoTA wrapper module
export default class IotaConnection extends BaseConnection {
    constructor(options) {
        super('iota', options)
    }

    getConnection(options) {
        return new IOTA({
            'provider': options.uri
        })
    }

    getNodeInfo() {
        return new Promise((resolve, reject) => {
            this.conn.api.getNodeInfo((err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    async getNewAddress() {
        return new Promise((resolve, reject) => {
            this.conn.api.getNewAddress(seed, {}, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    getTrytes(data) {
        const hash = sha256(JSON.stringify(data))
        log.debug(hash)
        const str = hash.toString(CryptoJS.enc.Base64)
        log.debug(str)
        const trytes = this.conn.utils.toTrytes(str)
        log.debug(trytes)
        return trytes
    }

    async createTransaction(data, metadata = {}) {
        log.debug(data)
        const trytes = this.getTrytes(data)
        const address = await this.getNewAddress()
        log.debug(address)
        const transfer = [{
            'address': address,
            'value': 0,
            'message': trytes
        }]

        let tx
        try {
            tx = await this._sendTransaction(transfer)
            log.debug(tx)
            return tx[0].hash
        } catch (error) {
            log.error(error)
            return ''
        }
    }

    async _sendTransaction(transfer) {
        return new Promise((resolve, reject) => {
            this.conn.api.sendTransfer(seed, 3, 15, transfer, {}, (err, tx) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(tx)
                }
            })
        })
    }

    async updateTransaction(transaction, updatedMetadata) { }
}

