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
            tokenId,
            _itemAuction.startTime,
            _itemAuction.endTime,
            _itemAuction.paymentToken,
            _itemAuction.amount,
            _itemAuction.gap,
        )
    )

    MarketplaceContract.on('BiddingForAuction',
        async (nftContract, tokenId, _itemAuction, event) => {
            const timestamp = (await provider.getBlock(event.blockNumber)).timestamp;
            biddingForAuction(
                nftContract,
                tokenId,
                _itemAuction.bidder,
                _itemAuction.amount,
                event.transactionHash,
                timestamp
            )
        }
    )

    MarketplaceContract.on('ListForBuyNow',
        (nftContract, tokenId, seller, isPhygital, paymentToken, price) =>
            listForBuyNow(
                nftContract,
                tokenId,
                paymentToken,
                price,
            )
    )

    MarketplaceContract.on('RemoveItemForBuyNow',
        (nftContract, tokenId) =>
            removeItemListed(
                nftContract,
                tokenId,
            )
    )

    MarketplaceContract.on('PhygitalItemUpdated',
        (nftContract, tokenId, state, nextUpdateDeadline) => {
            if (state == 0) removeItemListed(nftContract, tokenId, ITEM_STATE[4])
            if (state == 1) phygitalItemUpdate(
                nftContract,
                tokenId,
                ITEM_STATE[2],
                nextUpdateDeadline,
            )
            if (state == 2) removeItemListed(
                nftContract,
                tokenId,
                ITEM_STATE[3],
            )
        }

    )
}

module.exports = {
    marketplaceJobs
}