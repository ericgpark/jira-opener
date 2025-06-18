"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = __importStar(require("vscode"));
const extension = __importStar(require("../src/extension"));
// import * as myExtension from '../../extension';
suite('Extension Test Suite', () => {
    suiteTeardown(() => {
        vscode.window.showInformationMessage('All tests done!');
    });
    vscode.window.showInformationMessage('Running tests.');
    // test('Attempts to pull the JIRA host URL and the project key format from the configuration', () => {
    //   const config = vscode.workspace.getConfiguration('jiraOpener');
    //   config.update('hostUrl', 'https://your-domain.atlassian.net', vscode.ConfigurationTarget.Global);
    //   config.update('projectKeyFormat', '[A-Z]+-\\d+', vscode.ConfigurationTarget.Global);
    // });
    // test('Validates that the JIRA host URL is not empty', () => {
    //   const config = vscode.workspace.getConfiguration('jiraOpener');
    //   const host: string = config.get('hostUrl') ?? '';
    //   assert.ok(host.length > 0, 'JIRA host URL should not be empty');
    // });
    test('Should warn if JIRA host URL is empty', async () => {
        console.log(vscode.workspace);
        const config = await vscode.workspace.getConfiguration('jiraOpener');
        await config.update('hostUrl', undefined);
        console.log(config.get('hostUrl'));
        // Simulate activation
        let warned = false;
        const originalWarn = console.warn;
        console.warn = (msg) => {
            if (msg.includes('JIRA host is not valid'))
                warned = true;
        };
        // Import and activate extension
        extension.activate({ subscriptions: [] });
        console.warn = originalWarn;
        assert.ok(warned, 'Should warn about invalid JIRA host');
    });
    test('Should warn if project key format is empty', () => {
        const config = vscode.workspace.getConfiguration('jiraOpener');
        config.update('hostUrl', 'https://your-domain.atlassian.net', vscode.ConfigurationTarget.Global);
        config.update('projectKeyFormat', '', vscode.ConfigurationTarget.Global);
        let warned = false;
        const originalWarn = console.warn;
        console.warn = (msg) => {
            if (msg.includes('Project key format is not valid'))
                warned = true;
        };
        extension.activate({ subscriptions: [] });
        console.warn = originalWarn;
        assert.ok(warned, 'Should warn about invalid project key format');
    });
    test('Should warn if project key format is invalid regex', () => {
        const config = vscode.workspace.getConfiguration('jiraOpener');
        config.update('hostUrl', 'https://your-domain.atlassian.net', vscode.ConfigurationTarget.Global);
        config.update('projectKeyFormat', '[A-Z+-\\d+', vscode.ConfigurationTarget.Global); // Invalid regex
        let warned = false;
        const originalWarn = console.warn;
        console.warn = (msg) => {
            if (msg.includes('not a valid regular expression'))
                warned = true;
        };
        extension.activate({ subscriptions: [] });
        console.warn = originalWarn;
        assert.ok(warned, 'Should warn about invalid regex in project key format');
    });
    test('Should register DocumentLinkProvider when config is valid', () => {
        const config = vscode.workspace.getConfiguration('jiraOpener');
        config.update('hostUrl', 'https://your-domain.atlassian.net', vscode.ConfigurationTarget.Global);
        config.update('projectKeyFormat', '[A-Z]+-\\d+', vscode.ConfigurationTarget.Global);
        let registered = false;
        const originalRegister = vscode.languages.registerDocumentLinkProvider;
        vscode.languages.registerDocumentLinkProvider = function (selector, provider) {
            registered = true;
            return { dispose: () => { } };
        };
        extension.activate({ subscriptions: [] });
        vscode.languages.registerDocumentLinkProvider = originalRegister;
        assert.ok(registered, 'Should register DocumentLinkProvider');
    });
});
//# sourceMappingURL=extension.test.js.map