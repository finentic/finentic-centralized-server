const { ITEM_STATE } = require("../configs/constants")
const { marketplaceContract } = require("../configs/contracts")
const {
    listForAuction,
    biddingForAuction,
    listForBuyNow,
    phygitalItemUpdate,
    removeItemListed,
} = require("../controllers/item.controller")

const marketplaceJobs = async provider => {
    const MarketplaceContract = marketplaceContract(provider)

    MarketplaceContract.on('ListForAuction',
        (nftContract, tokenId, _itemAuction) => {
            console.log(
                'ListForAuction(',
                nftContract.toLowerCase(),
                tokenId.toString(),
                _itemAuction.startTime.toString(),
                _itemAuction.endTime.toString(),
                _itemAuction.paymentToken.toLowerCase(),
                _itemAuction.amount.toString(),
                _itemAuction.gap.toString(),
                ')',
            )
            listForAuction(
                nftContract.toLowerCase(),
                tokenId.toString(),
                _itemAuction.startTime.toString(),
                _itemAuction.endTime.toString(),
                _itemAuction.paymentToken.toLowerCase(),
                _itemAuction.amount.toString(),
                _itemAuction.gap.toString(),
            )
        }
    )

    MarketplaceContract.on('BiddingForAuction',
        async (nftContract, tokenId, bidder, amount, event) => {
            const timestamp = (await provider.getBlock(event.blockNumber)).timestamp;
            console.log(
                'BiddingForAuction(',
                nftContract.toLowerCase(),
                tokenId.toString(),
                bidder.toLowerCase(),
                amount.toString(),
                timestamp,
                ')',
            )
            biddingForAuction(
                nftContract.toLowerCase(),
                tokenId.toString(),
                bidder.toLowerCase(),
                amount.toString(),
                event.transactionHash,
                timestamp
            )
        }
    )

    MarketplaceContract.on('Invoice',
        async (buyer, seller, nftContract, tokenId, paymentToken, costs, event) => {
            const timestamp = (await provider.getBlock(event.blockNumber)).timestamp;
            console.log(
                'Invoice(',
                nftContract.toLowerCase(),
                tokenId.toString(),
                buyer.toLowerCase(),
                costs.toString(),
                event.transactionHash,
                timestamp,
                ')',
            )
            biddingForAuction(
                nftContract.toLowerCase(),
                tokenId.toString(),
                buyer.toLowerCase(),
                costs.toString(),
                event.transactionHash,
                timestamp
            )
        }
    )

    MarketplaceContract.on('ListForBuyNow',
        (nftContract, tokenId, seller, isPhygital, paymentToken, price) => {
            console.log(
                'ListForBuyNow(',
                nftContract.toLowerCase(),
                tokenId.toString(),
                paymentToken.toLowerCase(),
                price.toString(),
                ')',
            )
            listForBuyNow(
                nftContract.toLowerCase(),
                tokenId.toString(),
                paymentToken.toLowerCase(),
                price.toString(),
            )
        }
    )

    MarketplaceContract.on('RemoveItemForBuyNow',
        (nftContract, tokenId) => {
            console.log(
                'RemoveItemForBuyNow(',
                nftContract.toLowerCase(),
                tokenId.toString(),
                ITEM_STATE.CREATED,
                ')',
            )
            removeItemListed(
                nftContract.toLowerCase(),
                tokenId.toString(),
                ITEM_STATE.CREATED,
            )
        }
    )

    MarketplaceContract.on('RemoveItemForAuction',
        (nftContract, tokenId) => {
            console.log(
                'RemoveItemForAuction(',
                nftContract.toLowerCase(),
                tokenId.toString(),
                ITEM_STATE.CREATED,
                ')',
            )
            removeItemListed(
                nftContract.toLowerCase(),
                tokenId.toString(),
                ITEM_STATE.CREATED,
            )
        },
    )

    MarketplaceContract.on('PhygitalItemUpdated',
        (nftContract, tokenId, state, nextUpdateDeadline) => {
            tokenId = tokenId.toString()
            console.log(
                'PhygitalItemUpdated(',
                nftContract.toLowerCase(),
                tokenId.toString(),
                state,
                nextUpdateDeadline.toString(),
                ')',
            )
            if (state == 0) removeItemListed(nftContract, tokenId, ITEM_STATE.CREATED)
            if (state == 1) phygitalItemUpdate(
                nftContract.toLowerCase(),
                tokenId.toString(),
                ITEM_STATE.SOLD,
                nextUpdateDeadline,
            )
            if (state == 2) removeItemListed(
                nftContract,
                tokenId,
                ITEM_STATE.DELIVERED,
            )
        }
    )

    return MarketplaceContract
}

module.exports = {
    marketplaceJobs
}