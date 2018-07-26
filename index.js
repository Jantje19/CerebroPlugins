'use strict'

const os = require('os');

// Combines all plugins
const Open = require('Open/');
const Calc = require('Calc/');
const Notes = require('Notes/');
const Clock = require('Clock/');
const devRant = require('devRant/');
const SWA = require('StartWindowsApp/');
const SITV = require('ScreamIntoTheVoid/');
// const GS = require('GoogleSearch/');

const commands = {
	devRant: {
		func: devRant,
		name: 'devRant',
		command: 'devRant',
		description: 'Loads from the devRant feed',
		regEx: /^(devRant)/
	},
	SITV: {
		func: SITV,
		command: 'SITV',
		description: 'Out your frustration',
		name: 'Scream Into the Void',
		regEx: /^(SITV:?)\s+/i
	},
	SWA: {
		func: SWA,
		command: 'app',
		description: 'Opens Windows app',
		name: 'Search Windows app',
		regEx: /^((app:?)|-)(\s+)/i
	},
	Notes: {
		func: Notes,
		name: 'Notes',
		command: 'notes',
		regEx: /^(notes)/i,
		description: 'Creates notes'
	},
	Calc: {
		func: Calc,
		name: 'Calculator',
		command: 'calc',
		regEx: /^(calc)/i,
		description: 'Calculator with JavaScripts built in Math functions'
	},
	/*GoogleSearch: {
		func: GS,
		name: 'Google Search',
		command: 'gs',
		regEx: /^(gs)/i,
		description: 'Searches Google for given query'
	},*/
	Open: {
		func: Open,
		name: 'Open',
		command: 'open ' + os.homedir().replace(/\\/g, '\/') + '/Desktop/Documents/',
		regEx: /^(open|\~)\s+/i,
		description: 'Opens the given path'
	},
	Clock: {
		func: Clock,
		name: 'Clock',
		command: 'clock',
		regEx: /^(clock)/i,
		description: 'Shows analog clock'
	},
	AutoComplete: {
		regEx: /^(jantje19)/,
		func: (scope) => {
			for (let key in commands) {
				const command = commands[key];
				if (command.name && command.description && command.command) {
					scope.display({
						title: command.name,
						subtitle: command.description,
						onSelect: (evt) => {
							evt.preventDefault();
							scope.actions.replaceTerm(command.command);
						}
					});
				}
			}
		}
	}
};

const plugin = (scope) => {
	const term = scope.term;

	// if (term.startsWith('devRant'))
	// 	devRant(scope);
	// else if (term.match(/^(SITV:?)\s+/i))
	// 	SITV(scope);
	// else if (term.match(/^(app:?)\s+/i))
	// 	SWA(scope);
	// else if (term.match(/^(notes)/i)) {
	// 	Notes(scope);
	// } else if (term.match(/^(open|~)\s+/i)) {
	// 	const arr = term.match(/^(open|~)(\s+)(.+)/i);

	// 	if (arr) {
	// 		const path = arr[3];

	// 		if (path.trim() != '' && path != null) {
	// 			scope.display({
	// 				title: 'Open: ' + path,
	// 				subtitle: 'Opens the given path',
	// 				onSelect: () => scope.actions.reveal(path)
	// 			});
	// 		}
	// 	}
	// }

	for (let key in commands) {
		const command = commands[key];

		if (term.match(command.regEx)) {
			command.func(scope, os);
			break;
		}
	}
}

module.exports = {
	name: 'Jantje19 plugins',
	keyword: 'jantje19',
	fn: plugin
}