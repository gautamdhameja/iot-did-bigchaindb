// Base class for ledger backend logic

export default class BaseConnection {
    constructor(name, options) {
        if (new.target === BaseConnection) {
            throw new TypeError('Not possible to intantiate BaseConnection directly.')
        }

        this.name = name
        this.conn = this.getConnection(options)
    }

    getConnection(options) { }

    createTransaction(data, metadata = {}) { }

    updateTransaction(transaction, updatedMetadata) { }
}
