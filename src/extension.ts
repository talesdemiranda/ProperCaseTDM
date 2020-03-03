// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "propercase" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('TDM - ProperCase executado com sucesso!');

		const textEditor = vscode.window.activeTextEditor;
		if (!textEditor) {
			return;  // No open text editor
		}

		//let firstLine = textEditor.document.lineAt(0);
		//var lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
		const sel = textEditor.selection;
		let firstLine = textEditor.document.lineAt(sel.start.line);
		var lastLine = textEditor.document.lineAt(sel.end.line);
		var textRange = new vscode.Range(sel.start.line,
			firstLine.range.start.character,
			sel.end.line,
			lastLine.range.end.character);
		var linhaProper = "";
		var linha = "";
		var caractereAnterior = "";
		var plicasAberta = "N";
		var barraAsterisco = "N";
		let regexpNumberOrChar: RegExp = /[0-9]|[A-Z]/;
		var comentario = "N";

		//Tales Begin
		for (var numeroLinha: number = sel.start.line; numeroLinha <= sel.end.line; numeroLinha++) {
			linha = textEditor.document.lineAt(numeroLinha).text;
			comentario = "N";
			for (var caractere: number = 0; caractere < linha.length; caractere++) {
				//Não faz nada se estiver entre piclas
				if (linha.charAt(caractere) == "'") {
					if (plicasAberta == "S") {
						plicasAberta = "N";
					}
					else {
						plicasAberta = "S";
					}
				}

				//Não faz nada se estiver entre /* */
				if (linha.charAt(caractere) + linha.charAt(caractere + 1) == "/*" || linha.charAt(caractere) + linha.charAt(caractere + 1) == "*/") {
					if (barraAsterisco == "S") {
						barraAsterisco = "N";
						console.log('fechou barra asterisco na linha ' + (numeroLinha+1));
					}
					else {
						if (comentario == "N") {
							barraAsterisco = "S";
							console.log('abriu barra asterisco na linha' + (numeroLinha+1));
						}
					}
				}

				//Não faz nada se for comentário com --
				if (linha.charAt(caractere) + linha.charAt(caractere + 1) == "--") {
					comentario = "S";
					//console.log('comentário -- na linha ' + numeroLinha);
				}

				if (plicasAberta == "S" || barraAsterisco == "S" || comentario == "S") {
					linhaProper = linhaProper + linha.charAt(caractere);
					continue;
				}

				//Trata maíscula e miníscula
				if (caractere == 0 || !regexpNumberOrChar.test(caractereAnterior.toUpperCase())) {
					linhaProper = linhaProper + linha.charAt(caractere).toUpperCase();
				}
				else {
					linhaProper = linhaProper + linha.charAt(caractere).toLowerCase();
				}

				caractereAnterior = linha.charAt(caractere);
			}

			//Quebra linha quando acabar
			if (numeroLinha + 1 != textEditor.document.lineCount) {
				linhaProper = linhaProper + "\r\n";
			}

		}
		//Tales End

		textEditor.edit(function (editBuilder) {
			editBuilder.replace(textRange, linhaProper);
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
