import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../extension';

suite('Extension Test Suite', () => {
  suiteTeardown(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  vscode.window.showInformationMessage('Running tests.');

  test('Should warn if host URL is empty or invalid', async () => {
    const config = vscode.workspace.getConfiguration('jiraOpener');
    await config.update('hostUrl', '');

    let warned: boolean = false;
    const mockLogger = {
      warn: (msg: string) => {
        if (msg === 'JIRA Opener: JIRA host is not valid. Please check the extension settings.') {
          warned = true;
        }
      },
    };

    await extension.activate({ subscriptions: [] } as any, mockLogger as any);

    assert.ok(warned, 'Should warn about invalid host URL');
  });

  test('Should warn if project key format is empty', async () => {
    const config = vscode.workspace.getConfiguration('jiraOpener');
    await config.update('hostUrl', 'https://your-domain.atlassian.net');
    await config.update('projectKeyFormat', '');

    let warned = false;
    const mockLogger = {
      warn: (msg: string) => {
        if (msg === 'JIRA Opener: Project key format is not valid. Please check the extension settings.') {
          warned = true;
        }
      },
    };
    await extension.activate({ subscriptions: [] } as any, mockLogger as any);

    assert.ok(warned, 'Should warn about invalid project key format');
  });

  test('Should warn if project key format is invalid regex', async () => {
    const config = vscode.workspace.getConfiguration('jiraOpener');
    await config.update('hostUrl', 'https://your-domain.atlassian.net');
    await config.update('projectKeyFormat', '[A-Z+-\\d+'); // Invalid regex

    let warned = false;
    const mockLogger = {
      warn: (msg: string) => {
        if (msg === 'JIRA Opener: The project key format provided is not a valid regular expression. Please check your configuration in the extension settings.') warned = true;
      },
    };
    await extension.activate({ subscriptions: [] } as any, mockLogger as any);

    assert.ok(warned, 'Should warn about invalid regex in project key format');
  });

  test('Should register DocumentLinkProvider when config is valid', async () => {
    const config = vscode.workspace.getConfiguration('jiraOpener');
    await config.update('hostUrl', 'https://your-domain.atlassian.net');
    await config.update('projectKeyFormat', '[A-Z]+-\\d+');

    let registered = false;
    const originalRegister = vscode.languages.registerDocumentLinkProvider;

    // Mock registerDocumentLinkProvider
    (vscode.languages as any).registerDocumentLinkProvider = function () {
      registered = true;
      // Return a disposable as expected by VS Code API
      return { dispose() {} };
    };

    await extension.activate({ subscriptions: [] } as any);

    // Restore the original function
    (vscode.languages as any).registerDocumentLinkProvider = originalRegister;

    assert.ok(registered, 'Should register DocumentLinkProvider');
  });
});
