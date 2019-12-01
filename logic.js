const axios = require('axios');
const { prompt } = require('inquirer');
const chalk = require('chalk');

const category = ['defn', 'syn', 'anton'];


// For definitons
const defn = (word) => {
    axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/definitions?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`)
        .then(response => {
            response.data.forEach(element => {
                
                console.log(chalk.blue.bold(element.text));
            })
        })
        .catch(err => {
            console.log('Word not found');
        });
}
// For synonyms
const syn = (word) => {
    axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/relatedWords?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`)
        .then(response => {
            if (response) {
                response.data.forEach(relation => {
                    if (relation.relationshipType === 'synonym') {
                        console.log(relation.words);
                    }
                });
            }

        })
        .catch(err => console.log('No word found'));
};

// For antonyms
const ant = (word) => {
    let found = false;
    axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/relatedWords?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`)
        .then(response => {
            if (response) {
                response.data.forEach(relation => {
                    if (relation.relationshipType === 'antonym') {
                        found = true;
                        console.log(relation.words);
                    }
                });
            }
            if (!found) {
                console.log('Antonym does not exiss');
            }
        })
        .catch(err => console.log('No word found'));
};

// For examples
const examples = (word) => {
    axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/examples?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`)
        .then(response => {
            response.data.examples.forEach(element => {
                console.log(element.text, '\n');
            })
            // console.log(response.data.examples);
        })
        .catch(err => {
            console.log('Word not found');
        });
};

// For complete dictionry

const fullDict = (word) => {
    defn(word);
    syn(word);
    ant(word);
    examples(word);
};

const randomWord = () => {
    axios.get(`https://fourtytwowords.herokuapp.com/words/randomWord?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`)
        .then(response => {
            let word = response.data.word;
            console.log('The word is:::' + word);
            defn(word);
            syn(word);
            ant(word);
            examples(word);
        })
        .catch(err => console.log(err));
};

// For game
const play = async () => {
    let word = undefined;
    let synWord = [];
    let antWord = null;
    let defWord = [];

    // select random category
    const cat = category[Math.floor(Math.random() * category.length)];
    console.log(cat);

    // To get a randome word
    try {
        const randWord = await axios.get(`https://fourtytwowords.herokuapp.com/words/randomWord?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        // console.log('Here in 97');
        console.log(randWord.data.word);
        word = randWord.data.word;
        // console.log("the word is :::" + word); 
    }
    catch (err) {
        console.log('The error art 103');
    };

    // for getting definitions
    try {
        const defResponseData = await axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/definitions?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        defWord = [...defResponseData.data];
        console.log('The response is: ' + defWord);
    }
    catch (err) {
        console.log('sdfk');
    }


    // To get synonyms for that random word

    try {
        const synWords = await axios.get(`https://fourtytwowords.herokuapp.com/word/${word}/relatedWords?api_key=b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164`);
        synWords.data.forEach(relation => {
            if (relation.relationshipType === 'synonym') {
                synWord = [...relation.words, word];
                console.log(synWord);
            }
            if (relation.relationshipType === 'antonym') {
                antWord = [...relation.words, word];
                console.log(antWord);
            }
        });
        if (cat === 'anton' && antWord === null) {
            play();
        }
        testingIt(word, synWord, antWord, defWord, cat);
    }

    catch (err) {
        console.log('No word found');
    }






    // If the category is antonym and if there is no antonym for that word, we generate a new word.
 
    
}

const testingIt = async (newWord, newSynWord, newAntWord, newDefWord, cat, oldMessageChoice) => {
    let word = newWord;
    let synWord = newSynWord;
    let antWord = newAntWord;
    let defWord = newDefWord;
    let newCat = cat;
    let messageChoice = oldMessageChoice;

    if (newCat === 'syn') {
        messageChoice = synWord[0];
        synWord[Math.floor(Math.random() * synWord.length)];
    }

    if (newCat === 'anton') {
        messageChoice = antWord[0];
    }

    if (newCat === 'defn') {
        messageChoice = defWord[0].text;
    }

    const promptToUser = prompt([{
        type: 'input',
        name: 'guess',
        message: 'Please guess the correct word for the below \n' + messageChoice
    }])
        .then(answer => {
            if (synWord.includes(answer.guess)) {
                console.log('Sucess');
            }
            else {
                prompt([{
                    type: 'list',
                    name: 'wrongAnswer',
                    message: 'Wrong Answer:::Select One option',
                    choices: ['Try Again', 'Hint', 'Quit']
                }])
                    .then(answers => {
                        // Try again logic

                        if (answers.wrongAnswer === 'Try Again') {
                            console.log('Try again pressed');
                            testingIt(word, synWord, antWord, defWord, newCat, messageChoice);
                        }

                        // Quit logic
                        if (answers.wrongAnswer === 'Quit') {
                            console.log(`\nThe correct word is :: ${word} \n`);
                            console.log(`\nThe synonyms for the are: \n`);
                            console.log(synWord);
                            if (antWord) {
                                console.log(`\nThe antonyms for the word are: \n`);
                                console.log(antWord);
                            }
                            console.log('\nThe definitons of the word are:: \n');
                            defWord.forEach(element => {
                                console.log('>>>' + element.text);
                            })
                            // console.log(defWord);
                        }

                        // Hint Logic
                        if (answers.wrongAnswer === 'Hint') {
                            if (newCat === 'syn') {
                                console.log("The hint is an another synonym for this word: \n");
                                console.log(synWord[Math.floor(Math.random() * synWord.length)]);
                                testingIt(word, synWord, antWord, defWord, newCat, messageChoice);
                            }
                            if (newCat === 'defn') {
                                console.log("The hint is an another definition for this word: \n");
                                console.log(defWord[Math.floor(Math.random() * defWord.length)].text);
                                testingIt(word, synWord, antWord, defWord, newCat, messageChoice);
                            }
                            if (newCat === 'anton') {
                                console.log("The hint is an another Antonym for this word: \n");
                                console.log(antWord[Math.floor(Math.random() * antWord.length)]);
                                testingIt(word, synWord, antWord, defWord, newCat, messageChoice);
                            }

                        }
                    }
                    )
                    .catch(err => {
                        console.log('The erewfs dsafnjs ');
                    })
            }
        })
        .catch(err => console.log('Here in the last 172:::'));

}

// }




module.exports = { defn, play, syn, ant, examples, fullDict, randomWord };