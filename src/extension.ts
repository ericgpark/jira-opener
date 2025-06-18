import * as vscode from 'vscode';

export function createJiraDocumentLinkProvider(hostUrl: string, keyRegExp: RegExp): vscode.DocumentLinkProvider {
  return {
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
            const uri = vscode.Uri.parse(`${hostUrl}/browse/${match[0]}`);
            const link = new vscode.DocumentLink(range, uri);

            links.push(link);
          }
        }
      });

      return links;
    }
  };
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext, logger: Console = console) {
  // Save the host URL and the project key format from the extension settings
  const config = vscode.workspace.getConfiguration('jiraOpener');
  const hostUrl: string = config.get('hostUrl') ?? '';
  const projectKeyFormat: string = config.get('projectKeyFormat') ?? '';

  if (!hostUrl || !isValidUrl(hostUrl)) {
    logger.warn('JIRA Opener: JIRA host is not valid. Please check the extension settings.');
    logger.warn(`Provided host URL: ${hostUrl}`);
    return;
  } else if (!projectKeyFormat.length) {
    logger.warn('JIRA Opener: Project key format is not valid. Please check the extension settings.');
    return;
  }

  let keyRegExp: RegExp;
  try {
    keyRegExp = new RegExp(projectKeyFormat, 'g');
  } catch (e) {
    logger.warn('JIRA Opener: The project key format provided is not a valid regular expression. Please check your configuration in the extension settings.');
    return;
  }

  // Select all file types
  const selector: vscode.DocumentSelector = { scheme: 'file' };

  // Create a document link provider which handles the link creation
  const provider: vscode.DocumentLinkProvider = createJiraDocumentLinkProvider(hostUrl, keyRegExp);

  const documentLinkProviderDisposable = vscode.languages.registerDocumentLinkProvider(selector, provider);

  context.subscriptions.push(documentLinkProviderDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function isValidUrl(urlString: string) {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}
