const DB_NAME = "vscode.sqlite";
const BUNDLE = "com.whomwah.vscode";
const REPO = "whomwah/alfred-vscode-workflow";
const DATA_DIR = `${
  Deno.env.get("HOME")
}/Library/Application Support/Alfred/Workflow Data/${BUNDLE}`;
const DB_DIR = `${DATA_DIR}/db`;
const DATABASE = `${DB_DIR}/${DB_NAME}`;

export { DATABASE, DB_DIR, REPO };
