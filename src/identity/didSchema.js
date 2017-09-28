const didSchema = {
    'additionalProperties': false,
    'definitions': {},
    'properties': {
        '@context': {
            'id': 'http://example.com/example.json/properties/@context',
            'type': 'string'
        },
        'control': {
            'additionalItems': false,
            'id': 'http://example.com/example.json/properties/control',
            'items': {
                'additionalProperties': false,
                'id': 'http://example.com/example.json/properties/control/items',
                'properties': {
                    'signer': {
                        'additionalItems': false,
                        'id': 'http://example.com/example.json/properties/control/items/properties/signer',
                        'items': {
                            'id': 'http://example.com/example.json/properties/control/items/properties/signer/items',
                            'type': 'string'
                        },
                        'type': 'array'
                    },
                    'type': {
                        'id': 'http://example.com/example.json/properties/control/items/properties/type',
                        'type': 'string'
                    }
                },
                'type': 'object'
            },
            'type': 'array'
        },
        'created': {
            'id': 'http://example.com/example.json/properties/created',
            'type': 'string'
        },
        'id': {
            'id': 'http://example.com/example.json/properties/id',
            'type': 'string'
        },
        'owner': {
            'additionalItems': false,
            'id': 'http://example.com/example.json/properties/owner',
            'items': {
                'additionalProperties': false,
                'id': 'http://example.com/example.json/properties/owner/items',
                'properties': {
                    'expires': {
                        'id': 'http://example.com/example.json/properties/owner/items/properties/expires',
                        'type': 'string'
                    },
                    'id': {
                        'id': 'http://example.com/example.json/properties/owner/items/properties/id',
                        'type': 'string'
                    },
                    'publicKeyPem': {
                        'id': 'http://example.com/example.json/properties/owner/items/properties/publicKeyPem',
                        'type': 'string'
                    },
                    'type': {
                        'additionalItems': false,
                        'id': 'http://example.com/example.json/properties/owner/items/properties/type',
                        'items': {
                            'id': 'http://example.com/example.json/properties/owner/items/properties/type/items',
                            'type': 'string'
                        },
                        'type': 'array'
                    }
                },
                'required': [
                    'expires',
                    'type'
                ],
                'type': 'object'
            },
            'type': 'array'
        },
        'service': {
            'additionalProperties': false,
            'id': 'http://example.com/example.json/properties/service',
            'properties': {
                'openid': {
                    'id': 'http://example.com/example.json/properties/service/properties/openid',
                    'type': 'string'
                },
                'xdi': {
                    'id': 'http://example.com/example.json/properties/service/properties/xdi',
                    'type': 'string'
                }
            },
            'type': 'object'
        },
        'signature': {
            'additionalProperties': false,
            'id': 'http://example.com/example.json/properties/signature',
            'properties': {
                'created': {
                    'id': 'http://example.com/example.json/properties/signature/properties/created',
                    'type': 'string'
                },
                'creator': {
                    'id': 'http://example.com/example.json/properties/signature/properties/creator',
                    'type': 'string'
                },
                'signatureValue': {
                    'id': 'http://example.com/example.json/properties/signature/properties/signatureValue',
                    'type': 'string'
                },
                'type': {
                    'id': 'http://example.com/example.json/properties/signature/properties/type',
                    'type': 'string'
                }
            },
            'type': 'object'
        },
        'updated': {
            'id': 'http://example.com/example.json/properties/updated',
            'type': 'string'
        }
    },
    'required': [
        'owner',
        '@context',
        'id'
    ],
    'type': 'object'
}

export default didSchema

