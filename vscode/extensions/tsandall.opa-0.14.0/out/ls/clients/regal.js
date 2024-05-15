"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateRegal = exports.activateRegal = exports.regalPath = exports.isInstalledRegal = exports.promptForInstallRegal = void 0;
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const vscode = require("vscode");
const semver = require("semver");
const fs_1 = require("fs");
const command_exists_1 = require("command-exists");
const github_installer_1 = require("../../github-installer");
const util_1 = require("../../util");
const extension_1 = require("../../extension");
const child_process_1 = require("child_process");
let client;
let clientLock = false;
let outChan;
const minimumSupportedRegalVersion = '0.18.0';
function promptForInstallRegal(message) {
    const dlOpts = downloadOptionsRegal();
    (0, github_installer_1.promptForInstall)('regal', dlOpts.repo, message, dlOpts.determineBinaryURLFromRelease, dlOpts.determineExecutableName);
}
exports.promptForInstallRegal = promptForInstallRegal;
function isInstalledRegal() {
    if ((0, command_exists_1.sync)(regalPath())) {
        return true;
    }
    return false;
}
exports.isInstalledRegal = isInstalledRegal;
function promptForUpdateRegal() {
    const version = regalVersion();
    if (version === 'missing') {
        promptForInstallRegal('Regal is needed but not installed. Would you like to install it?');
        return;
    }
    // assumption here that it's a dev version or something, and ignore
    if (!semver.valid(version)) {
        return;
    }
    if (semver.gte(version, minimumSupportedRegalVersion)) {
        return;
    }
    const path = regalPath();
    let message = 'The version of Regal that the OPA extension is using is out of date. Click "Install" to update it to a new one.';
    // if the path is not the path where VS Code manages Regal,
    // then we show another message
    if (path === 'regal') {
        message = 'Installed Regal version ' + version + ' is out of date and is not supported. Please update Regal to ' +
            minimumSupportedRegalVersion +
            ' using your preferred method. Or click "Install" to use a version managed by the OPA extension.';
    }
    promptForInstallRegal(message);
    return;
}
function regalVersion() {
    let version = 'missing';
    if (isInstalledRegal()) {
        const versionJSON = (0, child_process_1.execSync)(regalPath() + ' version --format=json').toString().trim();
        const versionObj = JSON.parse(versionJSON);
        version = versionObj.version || 'unknown';
    }
    return version;
}
function regalPath() {
    let path = vscode.workspace.getConfiguration('opa.dependency_paths').get('regal');
    if (path !== undefined && path !== null) {
        path = (0, util_1.replaceWorkspaceFolderPathVariable)(path);
    }
    if (path !== undefined && path !== null && path.length > 0) {
        if (path.startsWith('file://')) {
            path = path.substring(7);
        }
        if ((0, fs_1.existsSync)(path)) {
            return path;
        }
    }
    // default case, attempt to find in path
    return 'regal';
}
exports.regalPath = regalPath;
class debuggableMessageStrategy {
    handleMessage(message, next) {
        // If the VSCODE_DEBUG_MODE environment variable is set to true, then
        // we can log the messages to the console for debugging purposes.
        if (process.env.VSCODE_DEBUG_MODE === 'true') {
            const messageData = JSON.parse(JSON.stringify(message));
            const method = messageData.method || 'response';
            console.log(method, JSON.stringify(messageData));
        }
        return next(message);
    }
}
function activateRegal(_context) {
    if (!outChan) {
        outChan = vscode_1.window.createOutputChannel("Regal");
    }
    // activateRegal is run when the config changes, but this happens a few times
    // at startup. We use clientLock to prevent the activation of multiple instances.
    if (clientLock) {
        return;
    }
    clientLock = true;
    promptForUpdateRegal();
    const version = regalVersion();
    if (version === 'missing') {
        extension_1.opaOutputChannel.appendLine('Regal LS could not be started because the "regal" executable is not available.');
        return;
    }
    // assumption here that it's a dev version or something, and ignore.
    // if the version is invalid, then continue as assuming a dev build or similar
    if (semver.valid(version)) {
        if (semver.lt(version, minimumSupportedRegalVersion)) {
            extension_1.opaOutputChannel.appendLine('Regal LS could not be started because the version of "regal" is less than the minimum supported version.');
            return;
        }
    }
    const serverOptions = {
        command: regalPath(),
        args: ["language-server"],
    };
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'rego' }],
        outputChannel: outChan,
        traceOutputChannel: outChan,
        revealOutputChannelOn: 0,
        connectionOptions: {
            messageStrategy: new debuggableMessageStrategy,
        },
        errorHandler: {
            error: (error, message, _count) => {
                console.error(error);
                console.error(message);
                return {
                    action: node_1.ErrorAction.Continue,
                };
            },
            closed: () => {
                console.error("client closed");
                return {
                    action: node_1.CloseAction.DoNotRestart,
                };
            },
        },
        synchronize: {
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher('**/*.rego'),
                vscode_1.workspace.createFileSystemWatcher('**/.regal/config.yaml'),
            ],
        },
        diagnosticPullOptions: {
            onChange: true,
            onSave: true,
        },
    };
    client = new node_1.LanguageClient('regal', 'Regal LSP client', serverOptions, clientOptions);
    client.start();
}
exports.activateRegal = activateRegal;
function deactivateRegal() {
    clientLock = false;
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivateRegal = deactivateRegal;
function downloadOptionsRegal() {
    return {
        repo: 'StyraInc/regal',
        determineBinaryURLFromRelease: (release) => {
            // release.assets.name contains {'darwin', 'linux', 'windows'}
            const assets = release.assets || [];
            const os = process.platform;
            let targetAsset;
            switch (os) {
                case 'darwin':
                    targetAsset = assets.filter((asset) => asset.name.indexOf('Darwin') !== -1)[0];
                    break;
                case 'linux':
                    targetAsset = assets.filter((asset) => asset.name.indexOf('Linux') !== -1)[0];
                    break;
                case 'win32':
                    targetAsset = assets.filter((asset) => asset.name.indexOf('Windows') !== -1)[0];
                    break;
                default:
                    targetAsset = { browser_download_url: '' };
            }
            return targetAsset.browser_download_url;
        },
        determineExecutableName: () => {
            const os = process.platform;
            switch (os) {
                case 'darwin':
                case 'linux':
                    return 'regal';
                case 'win32':
                    return 'regal.exe';
                default:
                    return 'regal';
            }
        }
    };
}
//# sourceMappingURL=regal.js.map