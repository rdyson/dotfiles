'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.advertiseLanguageServers = void 0;
const ls_1 = require("./ls");
const regal_1 = require("./clients/regal");
const opa_1 = require("../opa");
// advertiseLanguageServers checks if any of the supported language servers
// are installed and prompts the user to install them if not.
function advertiseLanguageServers(context) {
    // if the user has not yet been offered to install OPA,
    // don't offer to install language servers and wait for that process to complete.
    // advertiseLanguageServers is run again after OPA is installed.
    const promptedForOPAInstall = context.globalState.get('opa.prompts.install.opa');
    if (!(0, opa_1.opaIsInstalled)(context) && !promptedForOPAInstall) {
        return;
    }
    for (const languageServerID in ls_1.supportedLanguageServers) {
        const globalStateKey = 'opa.prompts.install.language_server.' + languageServerID;
        if (context.globalState.get(globalStateKey)) {
            continue;
        }
        context.globalState.update(globalStateKey, true);
        switch (languageServerID) {
            case 'regal':
                if ((0, regal_1.isInstalledRegal)()) {
                    break;
                }
                (0, regal_1.promptForInstallRegal)('Would you like to install Regal for live linting of Rego code?');
                break;
        }
    }
}
exports.advertiseLanguageServers = advertiseLanguageServers;
//# sourceMappingURL=advertise.js.map