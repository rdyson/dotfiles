"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const vscode_uri_1 = require("vscode-uri");
const child_process_1 = require("child_process");
const simple_git_1 = require("simple-git");
const path_1 = require("path");
// Private Types Declaration
// https://github.com/Axosoft/vscode-gitlens/blob/main/src/commands/externalDiff.ts#L19-L49
/*eslint-disable */
var Status;
(function (Status) {
    Status[Status["INDEX_MODIFIED"] = 0] = "INDEX_MODIFIED";
    Status[Status["INDEX_ADDED"] = 1] = "INDEX_ADDED";
    Status[Status["INDEX_DELETED"] = 2] = "INDEX_DELETED";
    Status[Status["INDEX_RENAMED"] = 3] = "INDEX_RENAMED";
    Status[Status["INDEX_COPIED"] = 4] = "INDEX_COPIED";
    Status[Status["MODIFIED"] = 5] = "MODIFIED";
    Status[Status["DELETED"] = 6] = "DELETED";
    Status[Status["UNTRACKED"] = 7] = "UNTRACKED";
    Status[Status["IGNORED"] = 8] = "IGNORED";
    Status[Status["ADDED_BY_US"] = 9] = "ADDED_BY_US";
    Status[Status["ADDED_BY_THEM"] = 10] = "ADDED_BY_THEM";
    Status[Status["DELETED_BY_US"] = 11] = "DELETED_BY_US";
    Status[Status["DELETED_BY_THEM"] = 12] = "DELETED_BY_THEM";
    Status[Status["BOTH_ADDED"] = 13] = "BOTH_ADDED";
    Status[Status["BOTH_DELETED"] = 14] = "BOTH_DELETED";
    Status[Status["BOTH_MODIFIED"] = 15] = "BOTH_MODIFIED";
})(Status || (Status = {}));
function isWindowsPath(path) {
    return /^[a-zA-Z]:\\/.test(path);
}
function isDescendant(parent, descendant) {
    if (parent === descendant) {
        return true;
    }
    if (parent.charAt(parent.length - 1) !== path_1.sep) {
        parent += path_1.sep;
    }
    // Windows is case insensitive
    if (isWindowsPath(parent)) {
        parent = parent.toLowerCase();
        descendant = descendant.toLowerCase();
    }
    return descendant.startsWith(parent);
}
function git(repository, gitCommandAndArgs) {
    (0, simple_git_1.default)(repository.rootUri.fsPath).raw(gitCommandAndArgs, (err, result) => {
        if (err && err.message) {
            vscode.window.showWarningMessage(err.message);
        }
    });
}
function difftool(repository, additionalArgs) {
    let config = vscode.workspace.getConfiguration('kaleidoscope');
    let tool = config.get('git.difftool');
    if (tool === 'Kaleidoscope') {
        git(repository, ['difftool', '-y', '--tool=Kaleidoscope', ...additionalArgs]);
    }
    else {
        git(repository, ['difftool', '-y', ...additionalArgs]);
    }
}
function mergetool(repository, additionalArgs) {
    let config = vscode.workspace.getConfiguration('kaleidoscope');
    let tool = config.get('git.mergetool');
    if (tool === 'Kaleidoscope') {
        git(repository, ['mergetool', '-y', '--tool=Kaleidoscope', ...additionalArgs]);
    }
    else {
        git(repository, ['mergetool', '-y', ...additionalArgs]);
    }
}
async function fileExists(path) {
    try {
        await vscode.workspace.fs.stat(vscode.Uri.parse(path));
        return true;
    }
    catch {
        let selection = await vscode.window.showWarningMessage(`${path} file does *not* exist`, 'More');
        if (selection && selection === 'More') {
            vscode.env.openExternal(vscode.Uri.parse('https://kaleidoscope.app'));
        }
        return false;
    }
}
function activate(context) {
    let extension = vscode.extensions.getExtension('vscode.git');
    if (!extension) {
        return;
    }
    let gitExtension = extension.exports;
    let gitAPI = gitExtension.getAPI(1);
    context.subscriptions.push(vscode.commands.registerCommand('kaleidoscope.diffFile', async (uri, uris) => {
        let config = vscode.workspace.getConfiguration('kaleidoscope');
        let diffPath = config.get('compareTool');
        if (!await fileExists(diffPath)) {
            return;
        }
        var paths = [];
        if (uris && uris?.length > 0) {
            paths = uris.map(r => r.fsPath);
        }
        else if (uri?.fsPath) {
            paths = [uri.fsPath];
        }
        else if (vscode.window.activeTextEditor) {
            let docUri = vscode.window.activeTextEditor.document.uri;
            if (docUri?.fsPath) {
                paths = [docUri.fsPath];
            }
        }
        if (paths.length === 0) {
            return;
        }
        let spawnOptions;
        spawnOptions = {
            detached: true
        };
        let workspaceName = vscode.workspace.name ?? "VSCode";
        const diff = (0, child_process_1.spawn)(diffPath, ['-l', workspaceName, ...paths], spawnOptions);
        diff.stdin?.end();
    }));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('kaleidoscope.diffSection', async (textEditor, edit) => {
        let config = vscode.workspace.getConfiguration('kaleidoscope');
        let diffPath = config.get('compareTool');
        if (!await fileExists(diffPath)) {
            return;
        }
        const selection = textEditor.selection;
        const text = textEditor.document.getText(selection);
        let spawnOptions;
        spawnOptions = {
            detached: true
        };
        let workspaceName = vscode.workspace.name ?? "VSCode";
        const diff = (0, child_process_1.spawn)(diffPath, ['-l', workspaceName, '-'], spawnOptions);
        diff.stdin?.write(text);
        diff.stdin?.end();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kaleidoscope.diffScm', (...resourceStates) => {
        if (!resourceStates.length) {
            return;
        }
        let paths = resourceStates.map(r => r.resourceUri.fsPath);
        let repository = gitAPI.repositories.filter(r => isDescendant(r.rootUri.fsPath, paths[0]))[0];
        if (paths.length === 1) {
            if (resourceStates[0].resourceGroupType === 1 /* Index */) {
                difftool(repository, ['--staged', ...paths]);
            }
            else {
                difftool(repository, paths);
            }
        }
        else {
            // Diff Staged and Unstaged: HEAD
            difftool(repository, ['HEAD', ...paths]);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kaleidoscope.mergeScm', (...resourceStates) => {
        if (!resourceStates.length) {
            return;
        }
        let paths = resourceStates.map(r => r.resourceUri.fsPath);
        let repository = gitAPI.repositories.filter(r => isDescendant(r.rootUri.fsPath, paths[0]))[0];
        mergetool(repository, paths);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kaleidoscope.showAllStagedChanges', (group) => {
        if (!group.resourceStates.length) {
            return;
        }
        let resourceState = group.resourceStates[0];
        let fullTargetFilePath = resourceState.resourceUri.fsPath;
        let repository = gitAPI.repositories.filter(r => isDescendant(r.rootUri.fsPath, fullTargetFilePath))[0];
        difftool(repository, ['--staged']);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kaleidoscope.showAllUnstagedChanges', (group) => {
        if (!group.resourceStates.length) {
            return;
        }
        let resourceState = group.resourceStates[0];
        let fullTargetFilePath = resourceState.resourceUri.fsPath;
        let repository = gitAPI.repositories.filter(r => isDescendant(r.rootUri.fsPath, fullTargetFilePath))[0];
        difftool(repository, []);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kaleidoscope.showStagedChangesInFolder', (resourceState) => {
        let path = vscode_uri_1.Utils.dirname(resourceState.resourceUri).fsPath;
        let repository = gitAPI.repositories.filter(r => isDescendant(r.rootUri.fsPath, path))[0];
        difftool(repository, ['--staged', path]);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kaleidoscope.showUnstagedChangesInFolder', (resourceState) => {
        let path = vscode_uri_1.Utils.dirname(resourceState.resourceUri).fsPath;
        let repository = gitAPI.repositories.filter(r => isDescendant(r.rootUri.fsPath, path))[0];
        difftool(repository, [path]);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kaleidoscope.textCompareEditor', (uri) => {
        let path = uri.fsPath;
        let repository = gitAPI.repositories.filter(r => isDescendant(r.rootUri.fsPath, path))[0];
        if (uri.scheme === 'merge-conflict.conflict-diff') {
            mergetool(repository, [path]);
        }
        else {
            difftool(repository, [path]);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kaleidoscope.showAllChangesFromScmTitle', () => {
        for (const repository of gitAPI.repositories) {
            // Diff Staged and Unstaged: HEAD
            difftool(repository, ['HEAD']);
        }
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map