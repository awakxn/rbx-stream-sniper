#### index.js
```javascript

const streamsniper = require('./streamsniper')

async function main(placeid, userid) {
    const result = await streamsniper(placeid, userid)
    console.log(result)
}

const placeid = 1000000 // <-- put placeid
const userid = 1000000 // <- put userid

main(placeid, userid)

// example output: javascript:Roblox.GameLauncher.joinGameInstance(1000000, 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX')

```
