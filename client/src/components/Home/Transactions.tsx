import React, { useEffect, useState } from "react"
import { faDollar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import vipTarifs from '../../utils/vipTarifs.json'

const Transactions = () => {

    const generateItems = (): Array<string> => {
        const itemsChance = {
            "vip1": { count: 40, price: "100" },
            "vip2": { count: 30, price: "200" },
            "vip3": { count: 20, price: "300" },
            "vip4": { count: 4, price: "400" },
            "vip5": { count: 3, price: "500" },
            "vip6": { count: 1, price: "600" },
            "vip7": { count: 1, price: "700" },
            "vip8": { count: 1, price: "800" }
        }
        let generatedItems: Array<string> = []
        let key: keyof typeof itemsChance
        for (key in itemsChance) {
            for (let i = 0; i < itemsChance[key].count; i++) {
                generatedItems.push(itemsChance[key].price!)
            }
        }
        return generatedItems
    }

    interface IData {
        price: string
        number: string
        color: string
    }

    const defaulDataGenerator = (): Array<IData> => {
        let data: Array<IData> = []
        let itemsVariety = generateItems()
        let min = 0
        let max = 99

        for (let i = 0; i < 7; i++) {
            let rnd = Math.floor(Math.random() * (max - min + 1) + min)
            let rnd2 = Math.floor(Math.random() * (999999 - 560000 + 1) + 560000)
            let rnd3 = Math.floor(Math.random() * 99)
            let rnd4 = Math.floor(Math.random() * 99)
            let rndColor = Math.random().toString(16).substr(-6)
            data.push({ price: itemsVariety[rnd], number: `${rnd3}${rnd2}${rnd4}`, color: `#${rndColor}` })
        }
        return data
    }

    const [transactionData, setTransactionData] = useState(defaulDataGenerator())

    useEffect(() => {
        let timer = setTimeout(transactionDataUpdate, Math.floor(Math.random() * 10000))
        return () => {
            clearTimeout(timer)
        }
    })

    const transactionDataUpdate = () => {
        let itemsVariety = generateItems()
        let min = 0
        let max = 99
        let rand = Math.floor(Math.random() * (max - min + 1) + min)
        let rand2 = Math.floor(Math.random() * (999999 - 560000 + 1) + 560000)
        let rand3 = Math.floor(Math.random() * 99)
        let rand4 = Math.floor(Math.random() * 99)
        let rndColor = Math.random().toString(16).substr(-6)

        let newTransactionData = [...transactionData]
        newTransactionData.unshift({ price: itemsVariety[rand], number: `${rand3}${rand2}${rand4}`, color: `#${rndColor}` })
        newTransactionData.pop()

        // console.log("transactionData", transactionData)
        // console.log("newTransactionData", newTransactionData)
        setTransactionData(newTransactionData)
    }



    return (
        <div className="mb-24">
            <h4 className="py-4 font-nunito">Random transactions (MOCK)</h4>

            <Transaction transactionDataElement={transactionData.at(0)} />
            <Transaction transactionDataElement={transactionData.at(1)} />
            <Transaction transactionDataElement={transactionData.at(2)} />
            <Transaction transactionDataElement={transactionData.at(3)} />
            <Transaction transactionDataElement={transactionData.at(4)} />
            <Transaction transactionDataElement={transactionData.at(5)} />
            <Transaction transactionDataElement={transactionData.at(6)} />

        </div>
    )
}

interface IData {
    price: string
    number: string
    color: string
}

interface TransactionType {
    transactionDataElement: IData | undefined
}

const Transaction: React.FC<TransactionType> = ({ transactionDataElement }) => {

    return (
        <div className="mb-2 mt-2">
            <div>
                <div style={{ background: transactionDataElement?.color }} className="flex m-1 pb-0.5 ">
                    <div className="w-1/12 " >
                        <FontAwesomeIcon color="white" size="sm" icon={faDollar} />
                    </div>
                    <div className="w-8/12  text-left self-center">
                        <span style={{ color: transactionDataElement?.color }} className="text-xs font-semibold bg-white px-1.5 rounded-lg text-green-400">Transaction</span>
                        <span className="text-xs font-semibold text-white pl-2">{transactionDataElement?.number}</span>
                    </div>
                    <div className="w-3/12 self-center text-right mr-1 pr-2">
                        <p className="text-white text-xs">{transactionDataElement?.price} TRX</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transactions