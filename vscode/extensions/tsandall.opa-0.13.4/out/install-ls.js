'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commandExistsSync = require('command-exists').sync;
// Language server binary -> Human-readable name
const supportedLanguageServers = {
    'regal': 'Regal',
};
// promptLanguageServers checks if any of the supported language servers
// are installed and prompts the user to enable them.
// If a user opts in, the language server is added to the list of enabled
// language servers in the OPA extension configuration.
function promptLanguageServers() {
    const configuration = vscode.workspace.getConfiguration('opa');
    const languageServers = configuration.get('languageServers') || [];
    // If the user has already enabled a language server, don't prompt them
    // to enable another one. This might be revisited in the future if we
    // want to support multiple language servers.
    if (languageServers.length > 0) {
        return;
    }
    for (const [languageServerID, languageServerName] of Object.entries(supportedLanguageServers)) {
        if (commandExistsSync(languageServerID)) {
            const btnText = 'Enable ' + languageServerName;
            vscode.window.showInformationMessage('You have ' + languageServerName + ' installed. Would you like to use it from the OPA plugin?', btnText).then((selection) => {
                if (selection === btnText) {
                    configuration.update('languageServers', languageServers.concat([languageServerID]), 
                    // This makes it a global configuration change for all
                    // OPA/Rego projects
                    true);
                }
            });
        }
    }
}
exports.promptLanguageServers = promptLanguageServers;
//# sourceMappingURL=install-ls.js.map