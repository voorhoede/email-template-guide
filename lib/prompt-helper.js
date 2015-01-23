'use strict';

var inquirer = require('inquirer'),
	Q = require('q');

/**
 *
 * @param {array} questions - objects containing questions to ask in prompt
 * @param {...object} questionOverride - overrides questions in questions array
 */
function inquire(questions){
	var deferred = Q.defer(),
		overrides;
	if(!questions || !questions.length){
		deferred.reject('no questions asked');
	}
	overrides = [].slice.call(arguments, 1);
	questions  = !overrides.length ? questions : skipQuestions(questions, overrides.map(function (override) {
		return override.name;
	}));
	inquirer.prompt(questions, function promptCallback(answers) {
		deferred.resolve(replaceAnswers.apply(null, [answers].concat(overrides)));
	});
	return deferred.promise;
}

/**
 * removes questions
 * @param {array} questions - original array of questions
 * @param {...string|array} names properties of questions to remove from questions array
 */
function skipQuestions(questions) {
	var filters,
		rest = [].slice.call(arguments, 1),
		firstArg = rest.slice().shift();

	filters = Array.isArray(firstArg) ? firstArg : rest;
	return questions.filter(function (question) {
		return filters.indexOf(question.name) < 0;
	});
}
/**
 * replaces answers in given object with replacements
 * @param {object} answers
 * @param {...object} replacements
 *
 */
function replaceAnswers(answers) {
	if(Array.isArray(answers) || typeof answers !== 'object'){
		throw new Error('`answers` argument should be an Object');
	}
	var replacements,
		rest = [].slice.call(arguments, 1),
		firstArg = rest.slice().shift();

	replacements =  Array.isArray(firstArg) ? firstArg : rest;
	if(!replacements.length){
		return answers;
	}
	return _.merge(answers, replacements.reduce(function (prev,curr) {
		var next = {};
		var nextName = curr.name;
		if(nextName) {
			next[nextName] = curr.value;
		}
		return _.assign(prev, next);
	},{}));
}

module.exports = {
	inquire: inquire,
	skipQuestions : skipQuestions,
	replaceAnswers: replaceAnswers
};