// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const baseURL = `https://rithm-jeopardy.herokuapp.com/api`
let categories = [];                                                        
const NUM_CATEGORIES = 14;
const startButton = $('#start-game');

function shuffleIds(array){
    const numElements = array.length;
    for(let i = numElements; i > 0; i--){
        const randomIndex = Math.floor(Math.random() * i);
        let temp = array[numElements - 1];
        array[numElements - 1] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */


async function getCategoryIds() {
    const categoryIds = [];
    const response = await axios.get(`${baseURL}/categories?count=${NUM_CATEGORIES}`);
    const {data} = response;
    // categories = [...categories, ...data];
    // console.log('categories', categories);
    for(let category of data){
        const id = category.id;
        categoryIds.push(id);
    }
    return shuffleIds(categoryIds);
}
const ids = getCategoryIds();
console.log('ids', ids);


/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const clueArray = [];
    const categoryObject = {};
    const response = await axios.get(`${baseURL}/category?id=${catId}`);
    const {data} = response;
    // console.log('data', data)
    categoryObject.title = data.title;
    for(let clue of data.clues){
        const clueObject = {};
        clueObject.question = clue.question;
        clueObject.answer = clue.answer;
        clueObject.showing = null;
        clueArray.push(clueObject);
    }
    categoryObject.clues = clueArray
    // console.log('categoryObject', categoryObject);
    return categoryObject;
}



getCategory(4);
/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const categoryObjects = [];
    if($('table').length){
        $('table').remove();
    }
    const $table = $('<table>', {border: '2',class: 'jeopardy'});
    const $tHead = $('<thead>', {});
    const $tbody = $('<tbody>', {});
    const $tHeadRow = $('<tr>', {});
    for(let i = 0; i < 6; i++){
        const categoryObject = await getCategory(categories[i]);
        // console.log('categoryObject', categoryObject);
        categoryObjects.push(categoryObject);
        const headCell = $('<th>');
        console.log('categoryObjects', categoryObjects);
        headCell.text(categoryObject.title);
        $tHeadRow.append(headCell);
    }
    for(let j = 0; j < 5; j++){
        const tBodyRow = $('<tr>');
        for(let col = 0; col < 6; col++){
            const clue = categoryObjects[col].clues[j];
            // console.log('clue', clue);
            const bodyCell = $('<td>');
            bodyCell.append('<i class="fa-solid fa-question"></i>');
            bodyCell.on('click', function(){
                console.log(clue)
                if(clue !== undefined){
                    if(clue.showing === null){
                        bodyCell.text(clue.question);
                        clue.showing = 'question';
                    }
                    else if(clue.showing === 'question'){
                        bodyCell.text(clue.answer);
                        clue.showing = 'answer';
                    }
                    
                
            }
            });
            
            tBodyRow.append(bodyCell);
        }
        $tbody.append(tBodyRow);
    }
    $tHead.append($tHeadRow);
    $table.append($tHead);
    $table.append($tbody);
    $('body').append($table);
    
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(clue, bodyCell) {
        if(clue !== undefined){
            if(clue.showing === null){
                bodyCell.text(clue.question);
                clue.showing = 'question';
            }
            else if(clue.showing === 'question'){
                bodyCell.text(clue.answer);
                clue.showing = 'answer';
            }
            
        
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const categoryIds = await getCategoryIds();
    categories = categoryIds;
    fillTable();
}

/** On click of start / restart button, set up game. */
startButton.on('click', setupAndStart);
// TODO

/** On page load, add event handler for clicking clues */

// TODO

