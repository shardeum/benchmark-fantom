let ethers
let jsonRpcUrl = 'http://localhost:4000'
let provider
const fs = require('fs')

function getRandomWallet() {
    return ethers.Wallet.createRandom()
}

async function generate(injectedEthers, accounts = 1) {
    ethers = injectedEthers
    provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    console.log('Creating accounts!!!')
    let publicAddresses = []
    let privateAddresses = []
    for (let i = 0; i < accounts; i++) {
        try {
            let senderWallet = getRandomWallet()
            // console.log(senderWallet.address, '!!!', `'${senderWallet.privateKey}',`,)
            const keys = {
                privateKey: senderWallet.privateKey,
                publicKey: senderWallet.address
            }
            privateAddresses.push(keys)
            publicAddresses.push(senderWallet.address)
        } catch (e) {
            console.log('Error:', e)
        }
    }
    try {
        fs.writeFileSync('publicAddresses.json', JSON.stringify(publicAddresses, null, 2))
        console.log(
            `Wrote ${accounts} in publicAddresses.json`
        )
    } catch (error) {
        console.log(`Couldn't write accounts to file: ${error.message}`)
    }

    try {
        fs.writeFileSync('privateAddresses.json', JSON.stringify(privateAddresses, null, 2))
        console.log(
            `Wrote ${accounts} in privateAddresses.json`
        )
    } catch (error) {
        console.log(`Couldn't write accounts to file: ${error.message}`)
    }

}

module.exports = { generate }
