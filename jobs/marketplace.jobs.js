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
        (nftContract, tokenId, _itemAuction) => listForAuction(
            nftContract,
            tokenId.toString(),
            _itemAuction.startTime,
            _itemAuction.endTime,
            _itemAuction.paymentToken,
            _itemAuction.amount,
            _itemAuction.gap,
        )
    )

    MarketplaceContract.on('BiddingForAuction',
        async (nftContract, tokenId, bidder, amount, event) => {
            const timestamp = (await provider.getBlock(event.blockNumber)).timestamp;
            biddingForAuction(
                nftContract,
                tokenId.toString(),
                bidder.toLowerCase(),
                amount,
                event.transactionHash,
                timestamp
            )
        }
    )

    MarketplaceContract.on('ListForBuyNow',
        (nftContract, tokenId, seller, isPhygital, paymentToken, price) => {
            listForBuyNow(
                nftContract,
                tokenId.toString(),
                paymentToken.toLowerCase(),
                price,
            )
        }
    )

    MarketplaceContract.on('RemoveItemForBuyNow',
        (nftContract, tokenId) =>
            removeItemListed(
                nftContract,
                tokenId.toString(),
                ITEM_STATE.CREATED,
            )
    )

    MarketplaceContract.on('PhygitalItemUpdated',
        (nftContract, tokenId, state, nextUpdateDeadline) => {
            tokenId = tokenId.toString()
            if (state == 0) removeItemListed(nftContract, tokenId, ITEM_STATE.CREATED)
            if (state == 1) phygitalItemUpdate(
                nftContract,
                tokenId,
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
}

module.exports = {
    marketplaceJobs
}