'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.JSONProvider = exports.opaOutputChannel = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const opa = require("./opa");
const util_1 = require("./util");
const configure_1 = require("./ls/configure");
const activate_1 = require("./ls/activate");
const advertise_1 = require("./ls/advertise");
exports.opaOutputChannel = vscode.window.createOutputChannel('OPA');
class JSONProvider {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
        this.content = "";
    }
    provideTextDocumentContent(_uri) {
        return this.content;
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    set(uri, note, output) {
        this.content = note;
        if (output !== undefined) {
            this.content += "\n" + JSON.stringify(output, undefined, 2);
        }
        this._onDidChange.fire(uri);
    }
}
exports.JSONProvider = JSONProvider;
function activate(context) {
    vscode.window.onDidChangeActiveTextEditor(showCoverageOnEditorChange, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(removeCoverageOnDocumentChange, null, context.subscriptions);
    activateCheckFile(context);
    activateCoverWorkspace(context);
    activateEvalPackage(context);
    activateEvalSelection(context);
    activateEvalCoverage(context);
    activateTestWorkspace(context);
    activateTraceSelection(context);
    activateProfileSelection(context);
    activatePartialSelection(context);
    activateClearPromptsCommand(context);
    // promote available language servers to users with none installed
    (0, advertise_1.advertiseLanguageServers)(context);
    // prompt users with language servers installed to enable them
    (0, configure_1.configureLanguageServers)(context);
    // start configured language servers
    (0, activate_1.activateLanguageServers)(context);
    // this will trigger the prompt to install OPA if missing, rather than waiting til on save
    // the manual running of a command
    opa.runWithStatus(context, 'opa', ['version'], '', (_code, _stderr, _stdout) => { });
    vscode.workspace.onDidChangeConfiguration((_event) => {
        // configureLanguageServers is run here to catch newly installed language servers,
        // after their paths are updated.
        (0, configure_1.configureLanguageServers)(context);
        (0, activate_1.activateLanguageServers)(context);
    });
}
exports.activate = activate;
const outputUri = vscode.Uri.parse(`json:output.jsonc`);
const coveredHighlight = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(64,128,64,0.5)',
    isWholeLine: true
});
const notCoveredHighlight = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(128,64,64,0.5)',
    isWholeLine: true
});
let fileCoverage = {};
function showCoverageOnEditorChange(editor) {
    if (!editor) {
        return;
    }
    showCoverageForEditor(editor);
}
function removeCoverageOnDocumentChange(e) {
    // Do not remove coverage if the output document changed.
    if (`${e.document.uri}` !== `${outputUri}`) {
        removeCoverage();
    }
}
function showCoverageForEditor(_editor) {
    Object.keys(fileCoverage).forEach((fileName) => {
        vscode.window.visibleTextEditors.forEach((value) => {
            if (value.document.fileName.endsWith(fileName)) {
                value.setDecorations(coveredHighlight, fileCoverage[fileName].covered);
                value.setDecorations(notCoveredHighlight, fileCoverage[fileName].notCovered);
            }
        });
    });
}
function showCoverageForWindow() {
    vscode.window.visibleTextEditors.forEach((value) => {
        showCoverageForEditor(value);
    });
}
function removeCoverage() {
    Object.keys(fileCoverage).forEach((fileName) => {
        vscode.window.visibleTextEditors.forEach((value) => {
            if (value.document.fileName.endsWith(fileName)) {
                value.setDecorations(coveredHighlight, []);
                value.setDecorations(notCoveredHighlight, []);
            }
        });
    });
    fileCoverage = {};
}
function setFileCoverage(result) {
    Object.keys(result.files).forEach((fileName) => {
        const report = result.files[fileName];
        if (!report) {
            return;
        }
        let covered = [];
        if (report.covered !== undefined) {
            covered = report.covered.map((range) => {
                return new vscode.Range(range.start.row - 1, 0, range.end.row - 1, 1000);
            });
        }
        let notCovered = [];
        if (report.not_covered !== undefined) {
            notCovered = report.not_covered.map((range) => {
                return new vscode.Range(range.start.row - 1, 0, range.end.row - 1, 1000);
            });
        }
        fileCoverage[fileName] = {
            covered: covered,
            notCovered: notCovered
        };
    });
}
function setEvalOutput(provider, uri, stderr, result, inputPath) {
    if (stderr !== '') {
        opaOutputShow(stderr);
    }
    else {
        opaOutputHide();
    }
    let inputMessage;
    if (inputPath === '') {
        inputMessage = 'no input file';
    }
    else {
        inputMessage = inputPath.replace('file://', '');
        inputMessage = vscode.workspace.asRelativePath(inputMessage);
    }
    if (result.result === undefined) {
        provider.set(outputUri, `// No results found. Took ${(0, util_1.getPrettyTime)(result.metrics.timer_rego_query_eval_ns)}. Used ${inputMessage} as input.`, undefined);
    }
    else {
        let output;
        if (result.result[0].bindings === undefined) {
            output = result.result.map((x) => x.expressions.map((x) => x.value));
        }
        else {
            output = result.result.map((x) => x.bindings);
        }
        provider.set(uri, `// Found ${result.result.length} result${result.result.length === 1 ? "" : "s"} in ${(0, util_1.getPrettyTime)(result.metrics.timer_rego_query_eval_ns)} using ${inputMessage} as input.`, output);
    }
}
function activateCheckFile(context) {
    const checkRegoFile = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const doc = editor.document;
        // Only check rego files
        if (doc.languageId === 'rego') {
            const args = ['check'];
            ifInWorkspace(() => {
                if (opa.canUseBundleFlags()) {
                    args.push('--bundle');
                }
                args.push(...opa.getRoots());
                args.push(...opa.getSchemaParams());
            }, () => {
                args.push(doc.uri.fsPath);
            });
            if (opa.canUseStrictFlag()) {
                args.push('--strict');
            }
            opa.runWithStatus(context, 'opa', args, '', (_code, stderr, _stdout) => {
                const output = stderr;
                if (output.trim() !== '') {
                    opaOutputShowError(output);
                }
                else {
                    opaOutputHide();
                }
            });
        }
    };
    const checkRegoFileOnSave = () => {
        if (checkOnSaveEnabled()) {
            checkRegoFile();
        }
    };
    const checkFileCommand = vscode.commands.registerCommand('opa.check.file', checkRegoFile);
    // Need to use onWillSave instead of onDidSave because there's a weird race condition
    // that causes the callback to get called twice when we prompt for installing OPA
    vscode.workspace.onWillSaveTextDocument(checkRegoFileOnSave, null, context.subscriptions);
    context.subscriptions.push(checkFileCommand);
}
function activateCoverWorkspace(context) {
    const coverWorkspaceCommand = vscode.commands.registerCommand('opa.test.coverage.workspace', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        for (const fileName in fileCoverage) {
            if (editor.document.fileName.endsWith(fileName)) {
                removeCoverage();
                return;
            }
        }
        fileCoverage = {};
        const args = ['test', '--coverage', '--format', 'json'];
        ifInWorkspace(() => {
            if (opa.canUseBundleFlags()) {
                args.push('--bundle');
            }
            args.push(...opa.getRoots());
        }, () => {
            args.push(editor.document.uri.fsPath);
        });
        opa.run(context, 'opa', args, '', (_, result) => {
            opaOutputHide();
            setFileCoverage(result);
            showCoverageForWindow();
        }, opaOutputShowError);
    });
    context.subscriptions.push(coverWorkspaceCommand);
}
function activateEvalPackage(context) {
    const provider = new JSONProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider(outputUri.scheme, provider);
    const evalPackageCommand = vscode.commands.registerCommand('opa.eval.package', onActiveWorkspaceEditor(outputUri, (editor, _inWorkspace) => {
        opa.parse(context, 'opa', opa.getDataDir(editor.document.uri), (pkg, _) => {
            const { inputPath, args } = createOpaEvalArgs(editor, pkg);
            args.push('--metrics');
            opa.run(context, 'opa', args, 'data.' + pkg, (stderr, result) => {
                setEvalOutput(provider, outputUri, stderr, result, inputPath);
            }, opaOutputShowError);
        }, (error) => {
            opaOutputShowError(error);
        });
    }));
    context.subscriptions.push(evalPackageCommand, registration);
}
function activateEvalSelection(context) {
    const provider = new JSONProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider(outputUri.scheme, provider);
    const evalSelectionCommand = vscode.commands.registerCommand('opa.eval.selection', onActiveWorkspaceEditor(outputUri, (editor) => {
        opa.parse(context, 'opa', opa.getDataDir(editor.document.uri), (pkg, imports) => {
            const { inputPath, args } = createOpaEvalArgs(editor, pkg, imports);
            args.push('--metrics');
            const text = editor.document.getText(editor.selection);
            opa.run(context, 'opa', args, text, (stderr, result) => {
                setEvalOutput(provider, outputUri, stderr, result, inputPath);
            }, opaOutputShowError);
        }, (error) => {
            opaOutputShowError(error);
        });
    }));
    context.subscriptions.push(evalSelectionCommand, registration);
}
function activateEvalCoverage(context) {
    const provider = new JSONProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider(outputUri.scheme, provider);
    const evalCoverageCommand = vscode.commands.registerCommand('opa.eval.coverage', onActiveWorkspaceEditor(outputUri, (editor) => {
        for (const fileName in fileCoverage) {
            if (editor.document.fileName.endsWith(fileName)) {
                removeCoverage();
                return;
            }
        }
        fileCoverage = {};
        opa.parse(context, 'opa', opa.getDataDir(editor.document.uri), (pkg, imports) => {
            const { inputPath, args } = createOpaEvalArgs(editor, pkg, imports);
            args.push('--metrics');
            args.push('--coverage');
            const text = editor.document.getText(editor.selection);
            opa.run(context, 'opa', args, text, (stderr, result) => {
                setEvalOutput(provider, outputUri, stderr, result, inputPath);
                setFileCoverage(result.coverage);
                showCoverageForWindow();
            }, opaOutputShowError);
        }, (error) => {
            opaOutputShowError(error);
        });
    }));
    context.subscriptions.push(evalCoverageCommand, registration);
}
function activateTestWorkspace(context) {
    const testWorkspaceCommand = vscode.commands.registerCommand('opa.test.workspace', () => {
        exports.opaOutputChannel.show(true);
        exports.opaOutputChannel.clear();
        const args = ['test'];
        args.push('--verbose');
        ifInWorkspace(() => {
            if (opa.canUseBundleFlags()) {
                args.push("--bundle");
            }
            args.push(...opa.getRoots());
        }, () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }
            args.push(editor.document.uri.fsPath);
        });
        opa.runWithStatus(context, 'opa', args, '', (code, stderr, stdout) => {
            if (code === 0 || code === 2) {
                exports.opaOutputChannel.append(stdout);
            }
            else {
                opaOutputShowError(stderr);
            }
        });
    });
    context.subscriptions.push(testWorkspaceCommand);
}
function activateTraceSelection(context) {
    const traceSelectionCommand = vscode.commands.registerCommand('opa.trace.selection', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const text = editor.document.getText(editor.selection);
        opa.parse(context, 'opa', opa.getDataDir(editor.document.uri), (pkg, imports) => {
            const { args } = createOpaEvalArgs(editor, pkg, imports);
            args.push('--format', 'pretty');
            args.push('--explain', 'full');
            opa.runWithStatus(context, 'opa', args, text, (code, stderr, stdout) => {
                exports.opaOutputChannel.show(true);
                exports.opaOutputChannel.clear();
                if (code === 0 || code === 2) {
                    exports.opaOutputChannel.append(stdout);
                }
                else {
                    opaOutputShowError(stderr);
                }
            });
        }, (error) => {
            opaOutputShowError(error);
        });
    });
    context.subscriptions.push(traceSelectionCommand);
}
function activateProfileSelection(context) {
    const profileSelectionCommand = vscode.commands.registerCommand('opa.profile.selection', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const text = editor.document.getText(editor.selection);
        opa.parse(context, 'opa', opa.getDataDir(editor.document.uri), (pkg, imports) => {
            exports.opaOutputChannel.show(true);
            exports.opaOutputChannel.clear();
            const { args } = createOpaEvalArgs(editor, pkg, imports);
            args.push('--profile');
            args.push('--format', 'pretty');
            opa.runWithStatus(context, 'opa', args, text, (code, stderr, stdout) => {
                if (code === 0 || code === 2) {
                    exports.opaOutputChannel.append(stdout);
                }
                else {
                    opaOutputShowError(stderr);
                }
            });
        }, (error) => {
            opaOutputShowError(error);
        });
    });
    context.subscriptions.push(profileSelectionCommand);
}
function activatePartialSelection(context) {
    const partialSelectionCommand = vscode.commands.registerCommand('opa.partial.selection', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const text = editor.document.getText(editor.selection);
        opa.parse(context, 'opa', opa.getDataDir(editor.document.uri), (pkg, imports) => {
            const depsArgs = ['deps', '--format', 'json',];
            ifInWorkspace(() => {
                depsArgs.push(...opa.getRootParams());
            }, () => {
                depsArgs.push('--data', editor.document.uri.fsPath);
            });
            depsArgs.push('data.' + pkg);
            opa.run(context, 'opa', depsArgs, '', (_, result) => {
                const refs = result.base.map((ref) => opa.refToString(ref));
                refs.push('input');
                vscode.window.showQuickPick(refs).then((selection) => {
                    if (selection !== undefined) {
                        exports.opaOutputChannel.show(true);
                        exports.opaOutputChannel.clear();
                        const { args } = createOpaEvalArgs(editor, pkg, imports);
                        args.push('--partial');
                        args.push('--format', 'pretty');
                        args.push('--unknowns', selection);
                        opa.runWithStatus(context, 'opa', args, text, (code, stderr, stdout) => {
                            if (code === 0 || code === 2) {
                                exports.opaOutputChannel.append(stdout);
                            }
                            else {
                                opaOutputShowError(stderr);
                            }
                        });
                    }
                });
            }, (msg) => {
                opaOutputShowError(msg);
            });
        }, (error) => {
            opaOutputShowError(error);
        });
    });
    context.subscriptions.push(partialSelectionCommand);
}
function activateClearPromptsCommand(context) {
    // this command is to allow users that have dismissed installation prompts from the plugin
    // to re-enable them. While mostly intended for development, it could be useful for users
    // who have dismissed a prompt and want to action it again. Clearing the global state is
    // otherwise a more involved process.
    const promptsClearCommand = vscode.commands.registerCommand('opa.prompts.clear', () => {
        exports.opaOutputChannel.appendLine('Clearing prompts');
        context.globalState.keys().forEach((key) => {
            if (key.startsWith('opa.prompts')) {
                exports.opaOutputChannel.appendLine(key);
                context.globalState.update(key, undefined);
            }
        });
    });
    context.subscriptions.push(promptsClearCommand);
}
function onActiveWorkspaceEditor(forURI, cb) {
    return () => {
        // Open the read-only document on the right most column. If no
        // read-only document exists yet, create a new one. If one exists,
        // re-use it.
        vscode.workspace.openTextDocument(forURI)
            .then(function (doc) {
            const found = vscode.window.visibleTextEditors.find((ed) => {
                return ed.document.uri === doc.uri;
            });
            if (found === undefined) {
                return vscode.window.showTextDocument(doc, vscode.ViewColumn.Three, true);
            }
            return found;
        });
        // TODO(tsandall): test non-workspace mode. I don't know if this plugin
        // will work if a single file is loaded. Certain features may not work
        // but many can.
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        const inWorkspace = !!vscode.workspace.workspaceFolders;
        cb(editor, !!inWorkspace);
    };
}
let informAboutWorkspace = true;
const informAboutWorkspaceOption = "Don't show this tip again";
function ifInWorkspace(yes, no = () => { }) {
    if (vscode.workspace.workspaceFolders) {
        yes();
    }
    else {
        if (informAboutWorkspace) {
            vscode.window.showInformationMessage("You're editing a single file. Open it inside a workspace to include " +
                "any relative modules and schemas in the OPA commands you run.", informAboutWorkspaceOption).then((selection) => {
                if (selection === informAboutWorkspaceOption) {
                    informAboutWorkspace = false;
                }
            });
        }
        no();
    }
}
function deactivate() {
}
exports.deactivate = deactivate;
function opaOutputShow(msg) {
    exports.opaOutputChannel.clear();
    exports.opaOutputChannel.append(msg);
    exports.opaOutputChannel.show(true);
}
function opaOutputShowError(error) {
    exports.opaOutputChannel.clear();
    exports.opaOutputChannel.append(formatErrors(error));
    exports.opaOutputChannel.show(true);
}
function opaOutputHide() {
    exports.opaOutputChannel.clear();
    exports.opaOutputChannel.hide();
}
function formatErrors(error) {
    try {
        const output = JSON.parse(error);
        let errors;
        if (output.error !== undefined) {
            if (!Array.isArray(output.error)) {
                errors = [output.error];
            }
            else {
                errors = output.error;
            }
        }
        else if (output.errors !== undefined) {
            errors = output.errors;
        }
        const msg = [];
        for (let i = 0; i < errors.length; i++) {
            let location_prefix;
            if (errors[i].location.file !== '') {
                location_prefix = `${errors[i].location.file}:${errors[i].location.row}`;
            }
            else {
                location_prefix = `<query>`;
            }
            msg.push(`${location_prefix}: ${errors[i].code}: ${errors[i].message}`);
        }
        return msg.join('\n');
    }
    catch (_) {
        return error;
    }
}
function checkOnSaveEnabled() {
    return vscode.workspace.getConfiguration('opa').get('checkOnSave');
}
function existsSync(path) {
    const parsed = vscode.Uri.parse(path);
    if (parsed.scheme === 'file') {
        return fs.existsSync(parsed.fsPath);
    }
    return fs.existsSync(path);
}
function getInputPath() {
    // look for input.json at the active editor's directory, or the workspace directory
    const activeDir = path.dirname(vscode.window.activeTextEditor.document.uri.fsPath);
    let parsed = vscode.Uri.file(activeDir);
    // If we're in a workspace, and there is no sibling input.json to the actively edited file, look for the file in the workspace root
    if (!!vscode.workspace.workspaceFolders && !fs.existsSync(path.join(activeDir, 'input.json'))) {
        parsed = vscode.workspace.workspaceFolders[0].uri;
    }
    // If the rootDir is a file:// URL then just append /input.json onto the
    // end. Otherwise use the path.join function to get a platform-specific file
    // path returned.
    const rootDir = opa.getDataDir(parsed);
    if (parsed.scheme === 'file') {
        return parsed.toString() + '/input.json';
    }
    return path.join(rootDir, 'input.json');
}
function createOpaEvalArgs(editor, pkg, imports = []) {
    const args = ['eval'];
    args.push('--stdin');
    args.push('--package', pkg);
    let inputPath = getInputPath();
    if (existsSync(inputPath)) {
        args.push('--input', inputPath);
    }
    else {
        inputPath = '';
    }
    imports.forEach((x) => {
        args.push('--import', x);
    });
    ifInWorkspace(() => {
        args.push(...opa.getRootParams());
        args.push(...opa.getSchemaParams());
    }, () => {
        args.push('--data', editor.document.uri.fsPath);
    });
    return { inputPath, args };
}
//# sourceMappingURL=extension.js.map