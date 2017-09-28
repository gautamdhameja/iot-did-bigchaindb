import { BigchainDBGraphQLConnection } from 'bigchaindb-graphql'
import BaseConnection from './baseConnection'
import _log from '../utils/logger'
import config from '../config'

const log = _log(module)

const publicKey = config.admin.publicKey
const privateKey = config.admin.privateKey

export default class BdbConnection extends BaseConnection {
    constructor(options) {
        super('bdb', options)
    }

    getConnection(options) {
        return new BigchainDBGraphQLConnection(options.uri)
    }

    async createTransaction(asset, metadata) {
        log.debug(asset)
        log.debug(metadata)
        const tx = await this.conn.createTransaction(publicKey, privateKey, asset, metadata)
        log.debug(tx)
        return tx
    }

    async updateTransaction(transaction, updatedMetadata) {
        const tx = await this.conn.transferTransaction(transaction, publicKey,
            privateKey, publicKey, updatedMetadata)
        log.debug(tx)
        return tx
    }
}

