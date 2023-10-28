const axios = require(`axios`)
var nbt = require('nbt');
var chalk = require(`chalk`)
var apiKey = `40ea918c-b79c-43c7-9d8e-762f32629072`
const sleep = ms => new Promise(r => setTimeout(r, ms));
var uuid = `0c8af76fbfb845b5b12eff827b3f172b`

var ascii = `
                                        d8888                   888    d8b                        888b    888          888    d8b  .d888 d8b                  
                                        d88888                   888    Y8P                        8888b   888          888    Y8P d88P"  Y8P                  
                                        d88P888                   888                               88888b  888          888        888                         
                                        d88P 888 888  888  .d8888b 888888 888  .d88b.  88888b.       888Y88b 888  .d88b.  888888 888 888888 888  .d88b.  888d888 
                                        d88P  888 888  888 d88P"    888    888 d88""88b 888 "88b      888 Y88b888 d88""88b 888    888 888    888 d8P  Y8b 888P"   
                                        d88P   888 888  888 888      888    888 888  888 888  888      888  Y88888 888  888 888    888 888    888 88888888 888     
                                        d8888888888 Y88b 888 Y88b.    Y88b.  888 Y88..88P 888  888      888   Y8888 Y88..88P Y88b.  888 888    888 Y8b.     888     
                                        d88P     888  "Y88888  "Y8888P  "Y888 888  "Y88P"  888  888      888    Y888  "Y88P"   "Y888 888 888    888  "Y8888  888 \n\n    
                                                                                                                       `
console.clear()
console.log(chalk.blueBright(ascii))

// async function decrypt(data){
//     return new Promise((resolve, reject)=>{
//         nbt.parse(data, (err, json) => {
//             if(err) reject(`there was an error`)
//             resolve(json.value.i.value.value[0].tag.value.display.value.Name.value)  //.value.i.value.value[0].tag.value.display.value.Name.value
//         })
//     })

// }

// async function AuctionsPromise(r,l){
//     var haveToDecrypt = r.data?.auctions
//     var auctionsRawList = []
//     for(let i = 0; i < l; i++){
//         var temp = Buffer.from(haveToDecrypt[i].item_bytes.data, `base64`)
//         auctionsRawList.push(temp)
//     }
//     let decrypts = auctionsRawList.map(auction => decrypt(auction));
//     var auctions = await Promise.all(decrypts)
//     return auctions

// }

// async function getAuctionsMain(){
//     var config = {
//         headers:{
//             apikey:apiKey
//         }
//     }
//     var r = await axios.get(`https://api.hypixel.net/skyblock/auction?key=${apiKey}&player=${uuid}&profile=267fc1c2-b099-4c78-96f1-b719da230ee0`, config)
//     var totalAuctions = r.data?.auctions
//     var auctionsLength = totalAuctions.length
//     var auctionList = await AuctionsPromise(r, auctionsLength)
//     // console.log(r.data.auctions[8])
//     return auctionList
// }

async function A(r,l){
        var haveToDecrypt = r.data?.auctions
        var Prices = []
        var isEnd = []
        for(let i =0; i<l; i++){
            Prices.push(haveToDecrypt[i].starting_bid)
            if(haveToDecrypt[i].highest_bid_amount == 0){
                isEnd.push("false")
            }else{
                isEnd.push("true")
            }
        }
        Prices = Prices.slice(4)
        isEnd = isEnd.slice(4)
        return [Prices, isEnd]
}

async function getGlobal(){
    var config = {
        headers:{
            apikey:apiKey
        }
    }
    var r = await axios.get(`https://api.hypixel.net/skyblock/auction?key=${apiKey}&player=${uuid}&profile=267fc1c2-b099-4c78-96f1-b719da230ee0`, config)
    return r
}

async function getAuctionsMain2(){
    var r = await getGlobal()
    var auctions = r.data.auctions
    var auctionsLength = auctions.length
    var auctionList = []
    for(let i = 0; i<auctionsLength; i++){
        var temp = auctions[i].item_name
        auctionList.push(temp)
    }
    return auctionList
    
}


async function main(){
    var auctions = await getAuctionsMain2()
    auctions = auctions.slice(4)
    var temp;
    var r;
    var tempListCheck = []

    while(true){
        r = await getGlobal()
        // console.log(r.data.auctions)
        temp = await getAuctionsMain2()
        var AuctionsPricesReturn = await A(r,temp.length)
        var AuctionsPrices = AuctionsPricesReturn[0]
        var isEnd = AuctionsPricesReturn[1]
        temp = temp.slice(4)
        temp.forEach(item =>{
            var index = temp.indexOf(item)
            var ended = isEnd[index]
            if(ended == `true`){
                console.log(`${chalk.greenBright(item)} was sold for ${AuctionsPrices[index]}`)
            }else{
                console.log(`${chalk.blueBright(item)} was not sold yet :(`)
            }
        })
        console.log(`\n`)
        await sleep(10000)
    }
}

main()
