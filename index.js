const streamsniper = require('./streamsniper')

async function main(placeid, userid) {
    const result = await streamsniper(placeid, userid)
    console.log(result)
}

const placeid = 1000000
const userid = 1000000

main(placeid, userid)