# JIRA Opener

This VS Code extension detects JIRA project keys in an open file and allows the user to click and open the corresponding issue in the browser.

## Features

This project utilizes the VS Code API and the tools within it to parse through the active text editor and locate strings that match a given JIRA project key. 

* Provide a screenshot/recording of the experience *

## Requirements

- The JIRA host must be provided as `JIRA_OPENER_HOST` in the .env file of the project using this extension.
- The default project key format of a ticket/issue [provided by JIRA](https://confluence.atlassian.com/adminjiraserver/changing-the-project-key-format-938847081.html) is ABC-1234 (two or more letters, a dash, followed by numerical values). Users can specify custom project key formats in regex in the .env file of the project, as `JIRA_OPENER_KEY_FORMAT`.


## Known Issues

## Release Notes

### 1.0.0

### 1.0.1

### 1.1.0

---

**Enjoy!**
