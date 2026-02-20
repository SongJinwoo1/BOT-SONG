const fs = require('fs')
global.botName = 'Bot 𝑺𝒐𝒏𝒈 𝑱𝒊𝒏 𝑾𝒐𝒐 ⚔️'
global.ownerNumber = ['201XXXXXXXXX'] // ضع رقمك هنا

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    delete require.cache[file]
    require(file)
})
