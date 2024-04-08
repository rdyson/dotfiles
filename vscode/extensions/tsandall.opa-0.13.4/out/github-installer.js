'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForInstall = void 0;
const fs = require("fs");
const https = require("https");
const os = require("os");
const url_1 = require("url");
const vscode = require("vscode");
const extension_1 = require("./extension");
const releaseDownloader = require('@fohlen/github-release-downloader');
let installDeclined = {};
function promptForInstall(binaryConfigKey, repo, message, determineBinaryURLFromRelease, determineExecutableName, callback) {
    if (installDeclined[binaryConfigKey]) {
        return;
    }
    vscode.window.showInformationMessage(message, 'Install')
        .then((selection) => {
        if (selection === 'Install') {
            install(binaryConfigKey, repo, determineBinaryURLFromRelease, determineExecutableName).then(() => {
                callback && callback();
            });
        }
        else {
            installDeclined[binaryConfigKey] = true;
        }
    });
}
exports.promptForInstall = promptForInstall;
async function install(binaryConfigKey, repo, determineBinaryURLFromRelease, determineExecutableName) {
    extension_1.opaOutputChannel.clear();
    extension_1.opaOutputChannel.show(true);
    extension_1.opaOutputChannel.appendLine('Getting latest release for your platform...');
    let url;
    try {
        url = await getDownloadUrl(repo, determineBinaryURLFromRelease);
        extension_1.opaOutputChannel.appendLine(`Found latest release: ${url}`);
        if (url === null || url === undefined || url.toString().trim() === '') {
            extension_1.opaOutputChannel.appendLine('Could not find the latest OPA release for your platform');
            return;
        }
    }
    catch (e) {
        extension_1.opaOutputChannel.appendLine('Something went wrong while getting the latest release:');
        extension_1.opaOutputChannel.appendLine(e);
        return;
    }
    extension_1.opaOutputChannel.appendLine(`Downloading ${repo} executable...`);
    let path;
    try {
        path = await downloadFile(url, determineExecutableName);
        extension_1.opaOutputChannel.appendLine(`Executable downloaded to ${path}`);
    }
    catch (e) {
        extension_1.opaOutputChannel.appendLine('Something went wrong while downloading the executable:');
        extension_1.opaOutputChannel.appendLine(e);
        return;
    }
    extension_1.opaOutputChannel.appendLine('Changing file mode to 0755 to allow execution...');
    try {
        fs.chmodSync(path, 0o755);
    }
    catch (e) {
        extension_1.opaOutputChannel.appendLine(e);
        return;
    }
    extension_1.opaOutputChannel.appendLine(`Setting 'opa.dependency_paths.${binaryConfigKey}' to '${path}'...`);
    try {
        await vscode.workspace.getConfiguration('opa.dependency_paths').update(binaryConfigKey, path, true);
    }
    catch (e) {
        extension_1.opaOutputChannel.appendLine('Something went wrong while saving the config setting:');
        extension_1.opaOutputChannel.appendLine(e);
        return;
    }
    extension_1.opaOutputChannel.appendLine(`Successfully installed ${repo}!`);
    extension_1.opaOutputChannel.hide();
}
// Downloads a file given a URL
// Returns a Promise that resolves to the absolute file path when the download is complete
async function downloadFile(url, determineExecutableName) {
    // Use the user's home directory as the default base directory
    const dest = os.homedir();
    return releaseDownloader.downloadAsset(url.href, determineExecutableName(), dest, () => {
        // Basic progress bar
        if (Math.floor(Date.now()).toString().endsWith('0')) {
            extension_1.opaOutputChannel.append('.');
        }
    });
}
async function getDownloadUrl(repo, determineBinaryURLFromRelease) {
    return new Promise((resolve, reject) => {
        // TODO: Honor HTTP proxy settings from `vscode.workspace.getConfiguration('http').get('proxy')`
        https.get({
            hostname: 'api.github.com',
            path: `/repos/${repo}/releases/latest`,
            headers: {
                'User-Agent': 'node.js',
                'Authorization': `token ${getToken()}`
            }
        }, (res) => {
            let rawData = '';
            res.on('data', (d) => {
                rawData += d;
            });
            res.on('end', () => {
                try {
                    const release = JSON.parse(rawData);
                    const url = determineBinaryURLFromRelease(release);
                    resolve(new url_1.URL(url));
                }
                catch (e) {
                    reject(e);
                }
            });
        }).on('error', (e) => reject(e));
    });
}
function getToken() {
    // Need an OAuth token to access Github because
    // this gets around the ridiculously low
    // anonymous access rate limits (60 requests/sec/IP)
    // This token only gives access to "public_repo" and "repo:status" scopes
    return ["0", "0", "b", "6", "2", "d", "1",
        "0", "4", "d", "8", "5", "4", "9",
        "4", "b", "d", "6", "e", "e", "9",
        "5", "f", "1", "7", "1", "b", "d",
        "0", "2", "3", "c", "e", "4", "a",
        "3", "9", "a", "0", "6"].join('');
}
//# sourceMappingURL=github-installer.js.map