const config = Object.freeze({
    'app': {
        'id': '62b8daa616d4b29530131bd6bdbed4bad67c92e3fd05681862026e2e28dd2190',
        'namespace': 'bdb.did',
        'types': [
            {
                'id': '05c89a54d57ece6715fb948bbc5a4d88bb5875188aca790d0830ec6308eeff83',
                'name': 'admin',
                'internalId': 100
            },
            {
                'id': 'e261216201a178dca863d91ad76476837d14e7fef236f2b3f64d15813248350a',
                'name': 'user',
                'internalId': 101
            },
            {
                'id': '3486d857b19be324f15472308ef285c44a574172c1deffa96cf2475e971e9dfc',
                'name': 'thing',
                'internalId': 102
            },
            {
                'id': '2df1d3189c1e6653ff3d1fd39123fe0108e2d8f8d97f72cce564afceb178a1c5',
                'name': 'message',
                'internalId': 103
            }
        ]
    },
    'admin': {
        'publicKey': '8sVFshXJ8ZM9iKtN94sdrXqpoFW3SVsH3Zg5HeEsgtMX',
        'privateKey': 'H5u66H6rn2V4RdQocABGmQH7NHMXZSBAe47DcqHjuRhY'
    },
    'environment': process.env.NODE_ENV || 'development',
    'server': {
        host: '0.0.0.0',
        port: process.env.NODE_PORT || process.env.PORT || 3000
    },
    'bdb': {
        host: process.env.BDB_SERVER_URL || 'http://localhost:29984/api/v1/',
    },
    'iota': {
        host: process.env.IOTA_SERVER_URL || 'http://node02.iotatoken.nl:14265/'
    }
})

export default config
