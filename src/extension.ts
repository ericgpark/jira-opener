import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Save the host URL and the project key format from the extension settings
  const config = vscode.workspace.getConfiguration('jiraOpener');
  const host: string = config.get('hostUrl') ?? '';
  const projectKeyFormat: string = config.get('projectKeyFormat') ?? '';

  if (!host.length) {
    console.warn('JIRA Opener: JIRA host is not valid. Please check the extension settings.');
    return;
  } else if (!projectKeyFormat.length) {
    console.warn('JIRA Opener: Project key format is not valid. Please check the extension settings.');
    return;
  }

  const keyRegExp = new RegExp(projectKeyFormat);

	console.log('JIRA Opener: Detecting for JIRA project keys...');

  const detectProjectKeys = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const textLines = editor.document.getText().split('\n');

      const commentTypes = [
        '/',
        '{',
        '*',
        '(',
        '#',
        '<',
        '>',
        '-',
        ';',
        '\'',
        '"',
        '%',
        '.',
        '!',
      ];

      const comments = textLines.filter((line) => { // Filter for lines of code that begin with these characters
        return commentTypes.includes(line.trim()[0]);
      });

      comments.forEach(comment => {
        console.log(comment);
        console.log(keyRegExp);
        console.log(comment.match(keyRegExp));
      });
    }
  }

  const outputChannelLanguageId = 'jira-opener-language';

  outputChannel = vscode.window.createOutputChannel(
    'jira-opener',
    outputChannelLanguageId,
  );
  const documentLinkProviderDisposable = vscode.languages.registerDocumentLinkProvider(
    { language: outputChannelLanguageId },
    {
      provideDocumentLinks: (doc) => {
        
      }
    }
  );

  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(detectProjectKeys));
}

// This method is called when your extension is deactivated
export function deactivate() {}
