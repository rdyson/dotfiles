'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateLanguageServers = void 0;
const vscode = require("vscode");
const regal_1 = require("./clients/regal");
const ls_1 = require("./ls");
function activateLanguageServers(context) {
    const configuration = vscode.workspace.getConfiguration('opa');
    const configuredLanguageServers = configuration.get('languageServers') || [];
    // Find any language servers that are enabled but not configured and
    // disable them.
    for (const languageServerID in ls_1.supportedLanguageServers) {
        if (configuredLanguageServers.includes(languageServerID)) {
            continue;
        }
        switch (languageServerID) {
            case 'regal':
                (0, regal_1.deactivateRegal)();
                break;
        }
    }
    // Enable any newly configured language servers.
    for (const languageServer of configuredLanguageServers) {
        switch (languageServer) {
            case 'regal':
                (0, regal_1.activateRegal)(context);
                break;
        }
    }
}
exports.activateLanguageServers = activateLanguageServers;
//# sourceMappingURL=activate.js.map