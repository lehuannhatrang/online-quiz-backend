export const CommonConfig = {
    SECRET: "65162ffcc06aaf7513b528c70eae9170df2da945",
    TOKEN_ACCESS_API: "e8412706b88ed9c8098ded3fa7813ce18c5a3752",
    MAX_AGE_SESSION: '24h',
    DATA_SOURCE_CONFIG: {
        TYPES: [
            {
                label: 'SDK',
                value: 'sdk',
            },
            {
                label: 'Apps Flyer',
                value: 'appsflyer',
            },
            {
                label: 'Payment',
                value: 'payment',
            },
        ],
        ACTIONS: [
            {
                label: 'Mask',
                value: 'mask',
            },
            {
                label: 'Unmask',
                value: 'unmask',
            },
        ],
        FORMATS: [
            {
                label: 'JSON',
                value: 'json',
            },
            {
                label: 'XML',
                value: 'xml',
            },
            {
                label: 'CSV',
                value: 'csv',
            },

        ],
        STATUS: [
            {
                label: 'Running',
                value: 'running',
            },
            {
                label: 'Pause',
                value: 'pause',
            }
        ]
    }
}