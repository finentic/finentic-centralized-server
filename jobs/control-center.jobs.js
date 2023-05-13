const { ACCOUNT_STATE, ROLES_MAPPING, ADMIN_ROLES_MAPPING } = require("../configs/constants")
const { controlCenterContract } = require("../configs/contracts")
const {
    updateState,
    addRole,
    removeRole,
    updateStateMulti,
} = require("../controllers/account.controller")


const controlCenterJobs = async provider => {
    const ControlCenterContract = controlCenterContract(provider)

    // Whitelist
    ControlCenterContract.on('AddToWhitelist',
        account => {
            console.log('AddToWhitelist: ' + account)
            updateState(account, ACCOUNT_STATE.VERIFIED)
        }
    )
    ControlCenterContract.on('RemoveFromWhitelist',
        account => {
            console.log('RemoveFromWhitelist: ' + account)
            updateState(account, ACCOUNT_STATE.UNVERIFIED)
        }
    )
    ControlCenterContract.on('AddMultiToWhitelist',
        accounts => {
            console.log('AddMultiToWhitelist: ' + accounts)
            updateStateMulti(accounts, ACCOUNT_STATE.VERIFIED)
        }
    )
    ControlCenterContract.on('RemoveMultiFromWhitelist',
        accounts => {
            console.log('RemoveMultiFromWhitelist: ' + accounts)
            updateStateMulti(accounts, ACCOUNT_STATE.UNVERIFIED)
        }
    )

    // Blacklist
    ControlCenterContract.on('AddToBlacklist',
        account => {
            console.log('AddToBlacklist: ' + account)
            updateState(account, ACCOUNT_STATE.BANNED)
        }
    )
    ControlCenterContract.on('RemoveFromBlacklist',
        account => {
            console.log('RemoveFromBlacklist: ' + account)
            updateState(account, ACCOUNT_STATE.UNVERIFIED)
        }
    )
    ControlCenterContract.on('AddMultiToBlacklist',
        accounts => {
            console.log('AddMultiToBlacklist: ' + accounts)
            updateStateMulti(accounts, ACCOUNT_STATE.BANNED)
        }
    )
    ControlCenterContract.on('RemoveMultiFromBlacklist',
        accounts => {
            console.log('RemoveMultiFromBlacklist: ' + accounts)
            updateStateMulti(accounts, ACCOUNT_STATE.UNVERIFIED)
        }
    )

    // Roles
    ControlCenterContract.on('RoleGranted',
        (role, account, _sender) => {
            console.log(ROLES_MAPPING[role] + ' Granted: ' + account)
            addRole(account, ROLES_MAPPING[role])
        }
    )
    ControlCenterContract.on('RoleRevoked',
        (role, account, _sender) => {
            console.log(ROLES_MAPPING[role] + ' Revoked: ' + account)
            removeRole(account, ROLES_MAPPING[role])
        }
    )
    ControlCenterContract.on('RoleAdminChanged',
        (role, previousAdminRole, newAdminRole) => {
            console.log(ROLES_MAPPING[role] + ' Role Admin Changed from ' + previousAdminRole + 'to' + newAdminRole)
            removeRole(previousAdminRole, ADMIN_ROLES_MAPPING[role])
            addRole(newAdminRole, ADMIN_ROLES_MAPPING[role])
        }
    )

    return ControlCenterContract
}

module.exports = {
    controlCenterJobs
}