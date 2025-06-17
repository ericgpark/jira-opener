import * as vscode from 'vscode';

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

  const keyRegExp = new RegExp(projectKeyFormat, 'g');

  const selector: vscode.DocumentSelector = { scheme: 'file' };
  const provider: vscode.DocumentLinkProvider = {
    provideDocumentLinks(doc: vscode.TextDocument): vscode.ProviderResult<vscode.DocumentLink[]> {
      const commentTypes = [ '/', '{', '*', '(', '#', '<', '>', '-', ';', '\'', '"', '%', '.', '!' ];
      const links: vscode.DocumentLink[] = [];
      const textLines = doc.getText().split('\n');

      textLines.forEach((line, lineIndex) => {
        if (!commentTypes.includes(line.trim()[0])) { // Ignore non-comments
          return;
        }
        const matches = line.matchAll(keyRegExp);
        for (const match of matches) {
          if (match.index !== undefined) {
            const startPos = new vscode.Position(lineIndex, match.index);
            const endPos = new vscode.Position(lineIndex, match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);
            const uri = vscode.Uri.parse(`${host}/browse/${match[0]}`);
            const link = new vscode.DocumentLink(range, uri);

            links.push(link);
          }
        }
      });

      return links;
    }
  };

  const documentLinkProviderDisposable = vscode.languages.registerDocumentLinkProvider(selector, provider);

  context.subscriptions.push(documentLinkProviderDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
