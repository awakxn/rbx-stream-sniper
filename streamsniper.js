// credit to Scream, this is just a nodejs fork
// https://github.com/ScreamBirb/stream-sniper

const https = require('https')

function getImageUrl(userId) {
    return new Promise((resolve, reject) => {
        https.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`, (req) => {
            let data = []

            req.on('data', (d) => {
                data.push(d)
            })
            req.on('end', () => {
                resolve(JSON.parse(Buffer.concat(data).toString()))
            })
        })
    })
}

function getThumbnails(serverdata) {
    if (serverdata)
        serverdata = JSON.stringify(serverdata)

    return new Promise((resolve, reject) => {

        let req = https.request({
            hostname: 'thumbnails.roblox.com',
            port: 443,
            path: '/v1/batch',
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Content-Length': serverdata.length
            }
        }, (res) => {
            let data = []

            res.on('data', (d) => {
                data.push(d)
            })
            res.on('end', () => {
                resolve(JSON.parse(Buffer.concat(data).toString()))
            })
        })

        req.write(serverdata)
        req.end()
    })
}

async function streamsniper(placeId, userId) {
    let imageReq = await getImageUrl(userId)
    let imageUrl = imageReq.data[0].imageUrl

    let cursor
    let cursor_check = 0

    while (true) {
        let data = await new Promise((resolve, reject) => {
            let url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=Desc&limit=100${cursor ? '&cursor' + cursor : ''}`
            
            https.get(url, (req) => {
                let servers = []

                req.on('data', (d) => {
                    servers.push(d)
                })
                req.on('end', (e) => {
                    resolve(JSON.parse(Buffer.concat(servers).toString()))
                })
            })
        })

        cursor = data.nextPageCursor

        if (!cursor)
            cursor_check++

        if (cursor_check >= 2)
            return
            
        for await (const server of data.data) {
            let serverdata = []

            for (const playerToken of server.playerTokens) {
                serverdata.push({
                    token: playerToken,
                    type: 'AvatarHeadshot',
                    size: '150x150',
                    requestId: server.id
                })
            }

            let thumbnails = await getThumbnails(serverdata)
            
            for (const thumbnail of thumbnails.data) {
                if (thumbnail.imageUrl == imageUrl) {
                    return `javascript:Roblox.GameLauncher.joinGameInstance(${placeId}, '${server.id}')`
                }
            }
        }
    }
}

module.exports = streamsniper