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
    ControlCenterContract.on(
        'AddToWhitelist',
        account => updateState(account, ACCOUNT_STATE.VERIFIED)
    )
    ControlCenterContract.on(
        'RemoveFromWhitelist',
        account => updateState(account, ACCOUNT_STATE.UNVERIFIED)
    )
    ControlCenterContract.on(
        'AddMultiToWhitelist',
        accounts => updateStateMulti(accounts, ACCOUNT_STATE.VERIFIED)
    )
    ControlCenterContract.on(
        'RemoveMultiFromWhitelist',
        accounts => updateStateMulti(accounts, ACCOUNT_STATE.UNVERIFIED)
    )

    // Blacklist
    ControlCenterContract.on(
        'AddToBlacklist',
        account => updateState(account, ACCOUNT_STATE.BANNED)
    )
    ControlCenterContract.on(
        'RemoveFromBlacklist',
        account => updateState(account, ACCOUNT_STATE.UNVERIFIED)
    )
    ControlCenterContract.on(
        'AddMultiToBlacklist',
        accounts => updateStateMulti(accounts, ACCOUNT_STATE.BANNED)
    )
    ControlCenterContract.on(
        'RemoveMultiFromBlacklist',
        accounts => updateStateMulti(accounts, ACCOUNT_STATE.UNVERIFIED)
    )

    // Roles
    ControlCenterContract.on(
        'RoleGranted',
        (role, account, _sender) => addRole(account, ROLES_MAPPING[role])
    )
    ControlCenterContract.on(
        'RoleRevoked',
        (role, account, _sender) => removeRole(account, ROLES_MAPPING[role])
    )
    ControlCenterContract.on(
        'RoleAdminChanged',
        (role, previousAdminRole, newAdminRole) => {
            removeRole(previousAdminRole, ADMIN_ROLES_MAPPING[role])
            addRole(newAdminRole, ADMIN_ROLES_MAPPING[role])
        }
    )
}

module.exports = {
    controlCenterJobs
}