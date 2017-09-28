import * as driver from 'bigchaindb-driver' // eslint-disable-line
import bip39 from 'bip39'
import _log from '../utils/logger'

const log = _log(module)
let conn

const seedAdmin = bip39.mnemonicToSeed('admin').slice(0, 32)
const seedUser1 = bip39.mnemonicToSeed('user1').slice(0, 32)
const seedUser2 = bip39.mnemonicToSeed('user2').slice(0, 32)
const seedThing1 = bip39.mnemonicToSeed('thing1').slice(0, 32)
const seedThing2 = bip39.mnemonicToSeed('thing2').slice(0, 32)

const admin1 = new driver.Ed25519Keypair(seedAdmin)
const user1 = new driver.Ed25519Keypair(seedUser1)
const user2 = new driver.Ed25519Keypair(seedUser2)
const thing1 = new driver.Ed25519Keypair(seedThing1)
const thing2 = new driver.Ed25519Keypair(seedThing2)

const nameSpace = 'bdb.did'

const appConfig = {
    app: {
        id: '',
        namespace: nameSpace,
        types: [
            {
                id: '',
                name: 'admin',
                internalId: 100
            },
            {
                id: '',
                name: 'user',
                internalId: 101
            },
            {
                id: '',
                name: 'thing',
                internalId: 102
            },
            {
                id: '',
                name: 'message',
                internalId: 103
            }
        ]
    },
    admin: {
        publicKey: '',
        privateKey: ''
    }
}

export default async function initialize(apiPath) {
    conn = new driver.Connection(apiPath)

    // create bootstrap keypairs
    const keyPairs = {
        'admin': admin1,
        'user1': user1,
        'user2': user2,
        'thing1': thing1,
        'thing2': thing2
    }

    appConfig.admin.publicKey = admin1.publicKey
    appConfig.admin.privateKey = admin1.privateKey

    log.info(JSON.stringify(keyPairs))

    if (conn) {
        // create admin user type
        const adminGroupAsset = {
            ns: `${nameSpace}.admin`,
            name: 'admin'
        }

        const adminGroupMetadata = {
            canLink: [admin1.publicKey]
        }

        const adminGroupId = (await createNewAsset(admin1, adminGroupAsset, adminGroupMetadata)).id
        log.info(`AdminGroup: ${adminGroupId}`)
        appConfig.app.types[0].id = adminGroupId

        // create admin user instance
        const adminUserMetadata = {
            event: 'User Assigned',
            date: new Date(),
            timestamp: Date.now(),
            publicKey: admin1.publicKey,
            eventData: {
                userType: 'admin'
            }
        }

        const adminUserId =
            (await createUser(admin1, adminGroupId, 'admin', admin1.publicKey, adminUserMetadata)).id
        log.info(`AdminUser1: ${adminUserId}`)

        // create app
        const appAsset = {
            ns: nameSpace,
            name: nameSpace
        }

        const appMetadata = {
            canLink: adminGroupId
        }

        const appId = (await createNewAsset(admin1, appAsset, appMetadata)).id
        log.info(`App: ${appId}`)
        appConfig.app.id = appId

        // create types

        // user type
        const userGroupId = (await createType('user', appId, adminGroupId)).id
        log.info(`UserGroup: ${userGroupId}`)
        appConfig.app.types[1].id = userGroupId

        // create user instances
        const user1Metadata = {
            event: 'User Assigned',
            date: new Date(),
            timestamp: Date.now(),
            publicKey: admin1.publicKey,
            eventData: {
                userType: 'user'
            }
        }
        const user1Id =
            (await createUser(admin1, userGroupId, 'user', user1.publicKey, user1Metadata)).id
        log.info(`User1: ${user1Id}`)

        const user2Metadata = {
            event: 'User Assigned',
            date: new Date(),
            timestamp: Date.now(),
            publicKey: admin1.publicKey,
            eventData: {
                userType: 'user'
            }
        }
        const user2Id =
            (await createUser(admin1, userGroupId, 'user', user2.publicKey, user2Metadata)).id
        log.info(`User2: ${user2Id}`)

        // non user types
        const thingGroupId = (await createType('thing', appId, userGroupId)).id
        log.info(`ThingGroup: ${thingGroupId}`)
        appConfig.app.types[2].id = thingGroupId

        const messageGroupId = (await createType('message', appId, thingGroupId)).id
        log.info(`MessageGroup: ${messageGroupId}`)
        appConfig.app.types[3].id = messageGroupId

        log.info(JSON.stringify(appConfig))
    }
}

async function createUser(adminKeyPair, userTypeId, userTypeName, userPublicKey, userMetadata) {
    const asset = {
        ns: `${nameSpace}.${userTypeName}`,
        link: userTypeId,
        createdBy: adminKeyPair.publicKey,
        type: userTypeName,
        policy: [
            {
                'condition': 'transaction.operation == \'TRANSFER\'',
                'rule': 'LEN(transaction.outputs) == 1'
            },
            {
                'condition': 'transaction.operation == \'TRANSFER\'',
                'rule': 'LEN(transaction.outputs[0].public_keys) == 1'
            },
            {
                'condition': 'transaction.operation == \'TRANSFER\'',
                'rule': `transaction.outputs[0].public_keys[0] == '${userPublicKey}'`
            }
        ],
        keyword: 'UserAsset'
    }

    const metadata = {
        event: 'User Added',
        date: new Date(),
        timestamp: Date.now(),
        publicKey: adminKeyPair.publicKey,
        eventData: {
            userType: userTypeName
        }
    }

    const instanceTx = await createNewAsset(adminKeyPair, asset, metadata)
    await transferAsset(instanceTx, adminKeyPair, userPublicKey, userMetadata)
    return instanceTx
}

async function createType(typeName, appId, canLinkAssetId) {
    const asset = {
        ns: `${nameSpace}.${typeName}`,
        link: appId,
        name: typeName
    }

    const metadata = {
        canLink: canLinkAssetId
    }

    return createNewAsset(admin1, asset, metadata)
}

async function createNewAsset(keypair, asset, metadata) {
    const condition = driver.Transaction.makeEd25519Condition(keypair.publicKey, true)

    const output = driver.Transaction.makeOutput(condition)
    output.public_keys = [keypair.publicKey]

    const transaction = driver.Transaction.makeCreateTransaction(
        asset,
        metadata,
        [output],
        keypair.publicKey
    )

    const txSigned = driver.Transaction.signTransaction(transaction, keypair.privateKey)
    let tx
    await conn.postTransaction(txSigned)
        .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(retrievedTx => {
            tx = retrievedTx
        })

    return tx
}

async function transferAsset(tx, fromKeyPair, toPublicKey, metadata) {
    const condition = driver.Transaction.makeEd25519Condition(toPublicKey)

    const output = driver.Transaction.makeOutput(condition)
    output.public_keys = [toPublicKey]

    const txTransfer = driver.Transaction.makeTransferTransaction(
        tx,
        metadata,
        [output],
        0
    )

    const txSigned = driver.Transaction.signTransaction(txTransfer, fromKeyPair.privateKey)
    let trTx
    await conn.postTransaction(txSigned)
        .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(retrievedTx => {
            trTx = retrievedTx
        })

    return trTx
}
