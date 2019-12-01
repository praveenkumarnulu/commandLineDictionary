#!/usr/bin/env node

const program = require('commander');
const { defn, play, syn, ant, examples, fullDict, randomWord } = require('./logic');

program
    .version('0.0.1')
    .description(' COntact management system');


program.command('defn <word>')
    .alias('d')
    .description('Get a definaiiotin afor a word.')
    .action((word) => {
        defn(word);
    });

program.command('syn <word>')
    .description('Get a synonym')
    .action((word) => {
        syn(word);
    });

program.command('ant <word>')
    .description('Get a antonym')
    .action((word) => {
        ant(word);
    });

program.command('ex <word>')
    .description('Get the exampls')
    .action((word) => {
        examples(word);
    });

program.arguments('<word>')
    .description('COmplete')
    .action((word) => {
        fullDict(word);
    });

if (process.argv.length === 2) {
    randomWord();
}


program.command('play')
    .alias('p')
    .description('To play the game')
    .action(() => {
        play();

    });

program.parse(process.argv);
