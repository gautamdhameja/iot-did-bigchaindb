const userDidTemplate = {
    '@context': 'http://schema.bdb.did.user',
    'owner': [{
        'id': '#key-1',
        'type': [
            'CryptographicKey',
            'EdDsaPublicKey'
        ],
        'expires': '',
        'publicKeyBase58': ''
    }],
    'created': '',
    'updated': '',
}

const thingDidTemplate = {
    '@context': 'http://schema.bdb.did.thing',
    'guardian': '',
    'owner': [{
        'id': '#key-1',
        'type': [
            'CryptographicKey',
            'EdDsaPublicKey'
        ],
        'expires': '',
        'publicKeyBase58': ''
    }],
    'created': '',
    'updated': '',
}

export { userDidTemplate, thingDidTemplate }
