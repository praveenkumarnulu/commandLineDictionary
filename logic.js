const axios = require('axios'); // To work with REST API's
const { prompt } = require('inquirer'); // To work with command line prompts
const chalk = require('chalk'); // To color the output

// Global variable declared which is used for Play option.
const category = ['defn', 'syn', 'anton'];


// Api to get the definitions for the user enetered word.
const defn = async (word) => {
    try {
        const response = await axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/definitions?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        console.log(chalk.yellow.underline.bold(`\n > The following are the definitions for the word "${word}" :`));
        response.data.forEach(element => {
            console.log(chalk.blue.bold('\n >' + element.text));
        })
    }
    catch (err) {
        console.log(chalk.red.bold(` The word - "${word}" not found in the dictionary`));
    };
}

// Api to get the Synonyms for the user enetered word.
const syn = async (word) => {
    try {
        const response = await axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/relatedWords?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        if (response) {
            console.log(chalk.yellow.underline.bold(`\n > The following are the Synonyms for the word "${word}" :`));
            response.data.forEach(relation => {
                if (relation.relationshipType === 'synonym') {
                    relation.words.forEach(synonym => {
                        console.log(chalk.blue.bold('\n >' + synonym));
                    });

                }
            });
        }

    }
    catch (err) {
        console.log(chalk.red.bold(` The word - "${word}" not found in the dictionary`));
    };
};

// Api to get the Antonyms for the user enetered word.
const ant = async (word) => {
    let found = false;
    try {
        const response = await axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/relatedWords?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);

        if (response) {
            response.data.forEach(relation => {
                if (relation.relationshipType === 'antonym') {
                    found = true;
                    console.log(chalk.yellow.underline.bold(`\n > The following are the Antonyms for the word "${word}" :`));
                    relation.words.forEach(antonym => {
                        console.log(chalk.blue.bold('\n >' + antonym));
                    });
                }
            });
        }
        if (!found) {
            console.log(chalk.red.underline.bold(`\n The word - "${word}" has no antonyms in the dictionary`));
        }
    }
    catch (err) {
        console.log(chalk.red.bold(` The word - "${word}" not found in the dictionary`))
    };
};

// Api to get the Examples for the user enetered word.
const examples = async (word) => {
    try {
        const response = await axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/examples?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        console.log(chalk.yellow.underline.bold(`\n > The following are the Examples for the word "${word}" :`));
        response.data.examples.forEach(element => {
            console.log(chalk.blue.bold('\n >' + element.text));
        });
    }
    catch (err) {
        console.log(chalk.red.bold(` The word - "${word}" not found in the dictionary`))
    };
};

// Api for complete dictionary for the user entered word.

const fullDict = async (word) => {
    await defn(word);
    await syn(word);
    await ant(word);
    await examples(word);
};

// Api to get a random word from the dictionary.
const randomWord = async () => {
    try {
        const response = await axios.get(`https://fourtytwowords.herokuapp.com/words/randomWord?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        let word = response.data.word;
        console.log(chalk.yellow.underline.bold(`\n > Word of the day is - "${word}" :`));
        await defn(word);
        await syn(word);
        await ant(word);
        await examples(word);
    }
    catch (err) {
        console.log(err)
    };
};

/**
 * This play() function is to generate a random category to display the user and get the definitions, synonyms, antonyms for the same.
 */
const play = async () => {
    let word = undefined;
    let synWord = []; // Store the synonyms for the generated random word
    let antWord = null; // Store the antonyms for the generated random word
    let defWord = []; // Store the defintions for the generated random word

    // select random category
    const cat = category[Math.floor(Math.random() * category.length)];

    // To get a random word
    try {
        const randWord = await axios.get(`https://fourtytwowords.herokuapp.com/words/randomWord?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        word = randWord.data.word;
    }
    catch (err) {
        console.log('Got an error while getting word from the api.');
    };

    // for getting definitions
    try {
        const defResponseData = await axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/definitions?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        defWord = [...defResponseData.data];
    }
    catch (err) {
        console.log('Got an error while getting definitions data from the api.');
    }

    // To get synonyms and antonyms for that random word
    try {
        const synWords = await axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/relatedWords?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        synWords.data.forEach(relation => {
            if (relation.relationshipType === 'synonym') {
                synWord = [...relation.words, word];
            }
            if (relation.relationshipType === 'antonym') {
                antWord = [...relation.words, word];
            }
        });
        // If the category is antonym and if there is no antonym for that word, we generate a new word.
        if (cat === 'anton' && antWord === null) {
            play();
        }
        gameLogic(word, synWord, antWord, defWord, cat);
    }
    catch (err) {
        console.log('No word found');
    }
}

// the function
const gameLogic = async (newWord, newSynWord, newAntWord, newDefWord, cat, oldMessageChoice) => {
    let word = newWord;
    let synWord = newSynWord;
    let antWord = newAntWord;
    let defWord = newDefWord;
    let newCat = cat;
    let messageChoice = oldMessageChoice;
    // let hintDict = defWord.splice(0,1);

    if (newCat === 'syn') {
        messageChoice = chalk.yellow.underline.bold('\nPlease guess the correct word for the below synonym\n\n ') + chalk.green.bold('>>>' +synWord[0]);
        synWord[Math.floor(Math.random() * synWord.length)];
    }

    if (newCat === 'anton' && antWord !== null) {
        messageChoice = chalk.yellow.underline.bold('\nPlease guess the correct word for the below antonym\n\n ') + chalk.green.bold('>>>' + antWord[0]);
    }

    if (newCat === 'defn') {
        messageChoice = chalk.yellow.underline.bold('\nPlease guess the correct word for the below defintion\n\n ') + chalk.green.bold('>>>' + defWord[0].text);
    }

    const promptToUser = prompt([{
        type: 'input',
        name: 'guess',
        message: messageChoice
    }])
        .then(answer => {
            if (synWord.includes(answer.guess) && answer.guess !== synWord[0]) {
                console.log(chalk.green.underline.bold(`\n *** You have guessed it correct. Congrats!!!  ***`));
            }
            else {
                prompt([{
                    type: 'list',
                    name: 'wrongAnswer',
                    message: chalk.red.underline.bold('\nWrong Answer::Select One option'),
                    choices: ['Try Again', 'Hint', 'Quit']
                }])
                    .then(answers => {
                        // Try again logic

                        if (answers.wrongAnswer === 'Try Again') {
                            gameLogic(word, synWord, antWord, defWord, newCat, messageChoice);
                        }

                        // Quit logic
                        if (answers.wrongAnswer === 'Quit') {
                            console.log(chalk.green.underline.bold(`\n >>The correct word is ==> ${word} \n`));
                            console.log(chalk.yellow.underline.bold(`\nThe synonyms for the are: \n`));
                            console.log(chalk.blue.bold(synWord));
                            if (antWord) {
                                console.log(chalk.yellow.underline.bold(`\nThe antonyms for the word are: \n`));
                                console.log(chalk.blue.bold(antWord));
                            }
                            console.log(chalk.yellow.underline.bold('\nThe definitons of the word are:: \n'));
                            defWord.forEach(element => {
                                console.log(chalk.blue.bold('>>>' + element.text));
                            })
                        }

                        // Hint Logic
                        if (answers.wrongAnswer === 'Hint') {
                            if (newCat === 'syn') {
                                console.log(chalk.yellow.underline.bold("\nThe hint is an another synonym for this word: "));
                                console.log(chalk.blue.bold(synWord[Math.floor(Math.random() * synWord.length)]));
                                gameLogic(word, synWord, antWord, defWord, newCat, messageChoice);
                            }
                            if (newCat === 'defn') {
                                console.log(chalk.yellow.underline.bold("The hint is an another definition for this word: "));
                                console.log(chalk.blue.bold(defWord[Math.floor(Math.random() * defWord.length)].text));
                                gameLogic(word, synWord, antWord, defWord, newCat, messageChoice);
                            }
                            if (newCat === 'antn') {
                                console.log(chalk.yellow.underline.bold("The hint is an another Antonym for this word: "));
                                console.log(chalk.blue.bold(antWord[Math.floor(Math.random() * antWord.length)]));
                                gameLogic(word, synWord, antWord, defWord, newCat, messageChoice);
                            }

                        }
                    }
                    )
                    .catch(err => {
                        console.log('The error is ' + err);
                    })
            }
        })
        .catch(err => console.log('The error is'+err));

}

// }




module.exports = { defn, play, syn, ant, examples, fullDict, randomWord };