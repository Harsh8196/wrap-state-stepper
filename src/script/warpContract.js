import { WarpFactory} from 'warp-contracts'

export default async function readContract(network,contractId,interactionId,shortKey,options) {
    let warp
    if(network === 'Mainnet'){

        warp = WarpFactory.forMainnet()

    } else if(network === "Testnet"){

        warp = WarpFactory.forTestnet()

    }
    console.log('options:', options)
    const contract = warp.contract(contractId)
    contract.setEvaluationOptions(options)
    const { sortKey, cachedValue } = await contract.readState(shortKey);
    const cachedState = {
        state: cachedValue.state,
        errorMessages: cachedValue.errorMessages[interactionId]
    }
    console.log(cachedValue.state)
    console.log('cachedValue.errorMessages',cachedValue.errorMessages)
    console.log(sortKey)
    return cachedState
}