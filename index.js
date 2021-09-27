// Resources

// https://www.mediawiki.org/wiki/API:Cross-site_requests
// https://friends.fandom.com/api.php?action=parse&pageid=1627&wrapoutputclass&format=json
// https://friends.fandom.com/api.php?action=query&list=search&srsearch=abstain&format=json
// https://www.mediawiki.org/w/api.php?action=help&modules=main
// url1: https://friends.fandom.com/api.php?action=opensearch&search=joey&format=json&origin=*

// fetch(url).then(res =>
//   res.json()).then(d => {
//     console.log(d);
//   });

// FNrawWikiPopUp -> Search Page.
// rawWikiPopUp -> Load Saved Words.

window.onload = function () {

  document.getElementById('btn01').addEventListener("click", fetchMovies);

  // Get the input field
  var input = document.getElementById("querykey");

  // Execute a function when the user releases a key on the keyboard
  input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("btn01").click();
    }
  });
}

const url = ['https://friends.fandom.com/',
  'https://how-i-met-your-mother.fandom.com/',
  'https://theoffice.fandom.com/',
  'https://bigbangtheory.fandom.com/',
  'https://harrypotter.fandom.com/',
  'https://breakingbad.fandom.com/',
  'https://pixar.fandom.com/',
  'https://gameofthrones.fandom.com/',
  'https://lotr.fandom.com/',
  'https://godfather.fandom.com/',
  'https://pirates.fandom.com/',
  'https://bakerstreet.fandom.com/',
  'https://dragonball.fandom.com/',
  'https://thehungergames.fandom.com/',
  'https://marvelcinematicuniverse.fandom.com/',
  'https://marvel.fandom.com/',
  'https://batman.fandom.com/',
  'https://dc.fandom.com/',
  'https://dcmovies.fandom.com/',
  'https://dcextendeduniverse.fandom.com/',
  'https://twilightsaga.fandom.com/',
  'https://twoandahalfmen.fandom.com/',
  'https://suits.fandom.com/',
  'https://terminator.fandom.com/',
  'https://southpark.fandom.com/',
  'https://starwars.fandom.com/',
  'https://pokemon.fandom.com/',
  'https://bojackhorseman.fandom.com/',
  'https://simpsons.fandom.com/',
  'https://fastandfurious.fandom.com/'
];

// Update link 103 loop count

const series = ['Friends', 'H.I.M.Y.M', 'The Office (US)', 'The Big Bang Theory',
  'Harry Potter', 'Breaking Bad', 'PIXAR', 'G.O.T', 'Lord of the Rings',
  'The Godfather', 'PotC', 'Sherlock', 'Dragonball', 'The Hunger Games',
  'M.C.U', 'Marvel Database', 'Batman', 'D.C. Database', 'D.C Movies', 'D.C. Extended Universe',
  'Twilight Saga', 'T.A.A.H.M', 'Suits', 'Terminator', 'South Park', 'Star Wars',
  'Pokemon', 'Bojack Horseman', 'Simpsons', 'Fast and Furious'];

var title;
var link;
var countWords = 0;
var countIgnoreWords = 0;
var html = '';
var html2 = '';
var dispHandle = 0;

var btnClickCount = 0;
var urlsArray = [];
var UDsynonymsArray = [];
var btnToggle = [];
var toastError = 0;
var storeWikiToFirebaseToggle = 0;

// Ignore Word

var ignoreWordArrayWord = [];
var ignoreWordArrayWordCount = [];
var countMerge = 0

var color = 1; //btnClass.js
var wordBadge = 'white';

var terminate = 0;

async function fetchMovies() {

  const key = document.getElementById('querykey').value;

  // Visibility Toggle
  var e = document.getElementById('result');
  e.style.display = 'block';
  dispHandle = 1;

  html = '';
  document.getElementById('result').innerHTML = null;

  for (i = 0; i < 30; i++) {

    const response = await fetch(url[i] + 'api.php?action=opensearch&search=' + key + '&format=json&origin=*').then(res =>
      res.json()).then(d => {
        console.log(d);

        title = d[1];
        link = d[3];
      });

    console.log(title);
    console.log(link);
    // console.log(len);

    len = title.length;

    // len == 0 ? alert(series[i] + ' no data'): null;

    html += `<p class="text-white">${series[i]}</p>`;
    for (j = 0; j < len; j++) {
      // console.log(title[j] + link[j]);

      // Regex the link
      // Fetch the title
      // Call the new API with title and fetch the html
      // search HTML for the word and count it
      // display the count next to the result in UI

      var input = link[j];
      var wiki = input.split('wiki/');

      // console.log(wiki + 'line 89');

      // always find ways to add 'await'. #life Tip#

      await fetch(wiki[0] + 'api.php?action=query&prop=revisions&titles=' + wiki[1] + '&rvprop=content&format=json&origin=*')
        .then(response => response.text())
        .then((data) => {

          lowCaseData = data.toLowerCase();
          console.log(lowCaseData);
          console.log('webpage content string - line 145');

          // var count = (lowCaseData.match(/apothecary/g) || []).length;

          // var word = 'acrimony';
          var word = document.getElementById('querykey').value.toLowerCase();
          var reGex = new RegExp(word, 'g');
          var count = (lowCaseData.match(reGex) || []).length;

          // // // // EXPERIMENT TO EXTRACT BETWEEN [[ ]] // // // //

          var getFromBetween = {
            results: [],
            string: "",
            getFromBetween: function (sub1, sub2) {
              if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
              var SP = this.string.indexOf(sub1) + sub1.length;
              var string1 = this.string.substr(0, SP);
              var string2 = this.string.substr(SP);
              var TP = string1.length + string2.indexOf(sub2);
              return this.string.substring(SP, TP);
            },
            removeFromBetween: function (sub1, sub2) {
              if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
              var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
              this.string = this.string.replace(removal, "");
            },
            getAllResults: function (sub1, sub2) {
              // first check to see if we do have both substrings
              if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

              // find one result
              var result = this.getFromBetween(sub1, sub2);
              // push it to the results array
              this.results.push(result);
              // remove the most recently found one from the string
              this.removeFromBetween(sub1, sub2);

              // if there's more substrings
              if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
                this.getAllResults(sub1, sub2);
              }
              else return;
            },
            get: function (string, sub1, sub2) {
              this.results = [];
              this.string = string;
              this.getAllResults(sub1, sub2);
              return this.results;
            }
          };

          // StarWars Fanodm Page of size 453996 creating call stack error. Word: 'Paragon', 'Arrant'
          // 'chauvinism' -> MCU -> 860619
          // 'fervid' -> Star Wars -> 385253
          // Sometimes about 1 out of 5, the Stack Error does not comes.
          //    JS is very moody. It does not throw stack error whenever it wants.
          // A workaround is to just ignore it.
          // Only URL Counter for this specific page will not work.
          if (lowCaseData.length == 453996) {
            lowCaseData = '';
          }
          if (lowCaseData.length == 460919) {
            lowCaseData = '';
          }
          if (lowCaseData.length == 860619) {
            lowCaseData = '';
          }
          if (lowCaseData.length == 385253) {
            lowCaseData = '';
          }

          //

          // if (lowCaseData.length == 453996 || 460919) {
          //   lowCaseData = '';
          // }
          //
          // This always sets 'lowCaseData' to null. Hence, line 218 does not work.
          // The split up alternative approach at 203 to 208 works fine.

          var resultObj = getFromBetween.get(lowCaseData, "[[", "]]");

          // console.log('line 208');
          // console.log(resultObj);
          // console.log(lowCaseData.length);
          // console.log(getFromBetween.get(lowCaseData, "[[", "]]"));

          for (var x in resultObj) {

            var str = resultObj[x];
            var reGex = new RegExp(word, 'g');
            var countInsideObj = (str.match(reGex) || []).length;
            countMerge += countInsideObj;

          }

          if (countMerge > 0) {
            ignoreWordArrayWord.push('[Hyperlinks] ' + word);
            ignoreWordArrayWordCount.push(countMerge);
          }

          // // // // END OF EXPERIMENT to EXTRACT BETWEEN [[ ]] // // //

          // // // IGNORE FILTER implementation // // //

          // var ignoreWord = 'dolorous edd'; // fetch from input field

          // WRONG : 'the hound, arya stark' or 'dolorous umbridge, the hound'
          // CORRECT :  'the hound,arya stark'

          // var ignoreWordList = 'the hound,arya stark';
          var ignoreWordList = document.getElementById('ignorewordlist').value.toLowerCase();
          var ignoreWordArray = ignoreWordList.split(','); //(2) ["the hound", "arya stark"]

          // console.log('array 152');
          // console.log(ignoreWordArray);

          // var ignoreWordReGex = new RegExp(ignoreWord, 'g');

          if (ignoreWordList.length > 1) {

            for (var x in ignoreWordArray) {
              var ignoreWordReGex = new RegExp(ignoreWordArray[x], 'g');
              var ignoreWordCount = (lowCaseData.match(ignoreWordReGex) || []).length;

              if (ignoreWordCount > 0) {

                ignoreWordArrayWord.push(ignoreWordArray[x]);
                ignoreWordArrayWordCount.push(ignoreWordCount);

              }
            }

            // console.log(ignoreWordArrayWord);
            // console.log(ignoreWordArrayWordCount);
            // console.log(ignoreWordCount + 'ignore words - line 149');
          }

          // // // END OF IGNORE FILTER IMPLEMENTATION // // //

          console.log(count);
          countWords = count;
        });

      if (countWords > 0) {

        html += `
        <div class="card my-2 py-0" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="right"
          ${"title='" +
          ignoreWordArrayWord.map((item, index) => {
            return "<b>" + item + "</b>" + " " + "~(" + ignoreWordArrayWordCount[index] + ")" + "<br>"
          }).join("")
          + "'"
          }
        >
          <div class="card-body d-flex justify-content-between py-1">
              <h6 class="card-title my-auto col-md-6">${title[j]}</h6>
              <div class="col-md-2"></div>
              <h6 class="card-title my-auto col-md-1">${'~(' + countWords + ')'}</h6>
              <button class="btn btn-primary" type="button" value=${link[j]} onclick="FNrawWikiPopUp(this)">#</button>
              <a href="${link[j]}" target="_blank" class="btn btn-primary p-2  col-md-1">Link</a>
              <button id=${link[j]} onclick='consoPut(this);' class="btn btn-primary mx-1 col-md-1">+</button>
            </div>
          </div>`;
      }

      else {
        html += '';
      }

      ignoreWordArrayWord.length = 0;
      ignoreWordArrayWordCount.length = 0;
      countMerge = 0;

    } // end of for loop

    document.getElementById('result').innerHTML += html;

    html = '';
    title = '';
    link = '';

    // Terminate search, 'X' button.

    if(terminate == 1){
      break;
    }

  } // end of for loop

  //toast
  toastCall();
  callToolTip();

}

function toastCall() {

  if (toastError == 1) {
    document.getElementById('toastContent').innerHTML = 'Operation Failed!';
    toastError = 0;
  }
  else {
    document.getElementById('toastContent').innerHTML = 'Operation Success!';
  }

  var options = {
    animation: true,
    delay: 2000
  };

  var ToastHTML = document.getElementById('liveToast');
  var ToastEle = new bootstrap.Toast(ToastHTML, options);

  ToastEle.show();

}

async function consoPut(e) {
  console.log(btnClickCount);
  console.log(e.id);

  urlsArray.push(e.id);
  btnClickCount++;

  document.getElementById(e.id).disabled = true;

  // Pushing Disabled Buttons to Array

  var bt = e.id;
  btnToggle.push(bt);


  if (btnClickCount == 1) {
    document.getElementById('btn02').disabled = false;
    // 'Force Update' is used if there are less than 3 options to select from list
    // take the array and push it to firebase

  }

  // Firebase Update

  if (btnClickCount == 3) {

    var searchInput = document.getElementById("querykey").value;
    var udSynonym = document.getElementById("synonyms").value;
    var altWord = document.getElementById("saveasword").value;
    // var altWord = document.getElementById("saveasword").value.length;
    btnClickCount = 0;

    // console.log(altWord.length);

    if (altWord.length > 1) {
      [searchInput, altWord] = [altWord, searchInput];
    }

    await firebase.database().ref('words/' + searchInput).set({
      urlsArray,
      udSynonym,
      altWord,
      wordBadge
    }).catch(err => {
      console.log(err);
      toastError = 1;
    });

    toastCall();
    releaseButtons();
  }
}

async function forceUpdate() {
  var searchInput = document.getElementById("querykey").value;
  var udSynonym = document.getElementById("synonyms").value;
  var altWord = document.getElementById("saveasword").value;

  btnClickCount = 0;

  if (altWord.length > 1) {
    [searchInput, altWord] = [altWord, searchInput];
  }

  if (urlsArray.length != 0) {
    await firebase.database().ref('words/' + searchInput).set({
      urlsArray,
      udSynonym,
      altWord
    }).catch(err => {
      console.log(err);
      toastError = 1;
    });

    toastCall();
    releaseButtons();
  }

  else {
    toastError = 1;
    toastCall();
  }
}

function releaseButtons() {

  for (i = 0; i < btnToggle.length; i++) {
    var bt = btnToggle[i];
    document.getElementById(bt).disabled = false;

  }

  document.getElementById("synonyms").value = '';
  document.getElementById("saveasword").value = '';
  document.getElementById("ignorewordlist").value = '';
  btnClickCount = 0;
  urlsArray.length = 0;
  btnToggle.length = 0;

}

function showhideToggle() {
  // var e = document.getElementById(id);
  // e.style.display = (e.style.display == 'block') ? 'none' : 'block';

  var e = document.getElementById('result');
  var e2 = document.getElementById('DBresult');

  if (dispHandle == 1) {

    e.style.display = 'block';
    e2.style.display = 'none';
    dispHandle = 0;

  }

  e.style.display = (e.style.display == 'block') ? 'none' : 'block';
  e2.style.display = (e2.style.display == 'none') ? 'block' : 'none';
}

async function loadDB() {

  document.getElementById('DBresult').innerHTML = '';

  // Visibility Toggle
  var e = document.getElementById('DBresult');
  e.style.display = 'block';
  dispHandle = 1;

  var loadURL = 'https://mag1000gre-default-rtdb.europe-west1.firebasedatabase.app/words.json';

  await fetch(loadURL).then(res =>
    res.json()).then(data => {
      console.log(data);

      // for (var prop in data) {
      //   alert("Key:" + prop);
      //   alert("Value:" + data[prop]);
      // }

      var word = [];
      var wordData = [];
      var wordSynonym = [];
      var wCount = 0;

      var wordAlt;
      var wordAltHtml;
      var wordBadge;

      for (var prop in data) {

        // console.log(data[prop].urlsArray);

        word.push(prop); //prop -> word
        wordData = data[prop].urlsArray; // urls associated with the word.
        wordSynonym = data[prop].udSynonym;
        wordAlt = data[prop].altWord;
        wordBadge = data[prop].wordBadge;
        wCount++;

        // a copy of content to firebase for backup and easy access.
        // 'Switch OFF' once the database generated a backup.
        // 'Switch ON' if backup has to be updated with new words or data to replace

        if (storeWikiToFirebaseToggle == 1) {
          storeWikiToFirebase(prop, wordData);
        }

        //array.forEach(item => console.log(item));

        // implement word badge color.

        // var count = 0;

        // console.log(prop);
        // console.log(count++);

        if (wordBadge == 'green') {
          wordBadge = 'word-badge-green'
        }

        else if (wordBadge == 'blue') {
          wordBadge = 'word-badge-blue'
        }

        else if (wordBadge == 'white') {
          wordBadge = '';
        }


        html2 += `
        <div class="card my-2 py-0">
          <div class="${wordBadge} card-body d-flex py-1">
          <h6 class="card-title my-auto col-md-1">${wCount}</h6>
          <h6 class="card-title my-auto col-md-3">${typeof wordAlt === 'string' && wordAlt.length > 1 ? prop + ' (' + wordAlt + ')' : prop
          }</h6>
              <div class="col-md-4 my-auto" name='${prop}'>
              ${wordSynonym ? wordSynonym : ``
          }
              </div>
              <button class="btn btn-primary" type="button" id="${prop}" value="${wordSynonym ? wordSynonym : ``}" onclick="rawWikiPopUp(this)">#</button>
              ${wordData.map(item => {
            return "<a href='" + item + "' target='_blank' class='btn btn-primary px-3 col-md-1 mx-1'>Link</a>"
          }).join("")
          }
              </div>
            </div>
          </div>`;

      }
      // console.log(word);
      // console.log(wordData[0]);

    });

  document.getElementById('DBresult').innerHTML += html2;
  html2 = null;
  storeWikiToFirebaseToggle = 0;
  toastCall();
}

function callToolTip() {

  // It needs to be called explicitly in order html/css/tooltip-position to work.
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}

// wiki content to Firebase for backup and easy access purpose
// 'TOGGLE SWITCH' for this function is at line 492

async function storeWikiToFirebase(word, wordUrls) {

  // var url = "https://harrypotter.fandom.com/wiki/Dementor";

  var contentArray = [];

  for (var x in wordUrls) {

    var url = wordUrls[x];
    var wiki = url.split('wiki/');

    await fetch(wiki[0] + 'api.php?action=query&prop=revisions&titles=' + wiki[1] + '&rvprop=content&format=json&origin=*')
      .then(response => response.json())
      .then((data) => {
        var rawData = data.query.pages;
        var key = Object.keys(rawData);

        // console.log(key);
        // console.log(rawData[key].revisions[0]["*"]);

        try {
          var content = rawData[key].revisions[0]["*"];
        }
        catch (err) {
          console.log(err);
        }
        // var content = rawData[key].revisions[0]["*"];
        contentArray.push(content);

      });
  }

  await firebase.database().ref('wordContent/' + word).set({
    contentArray
  }).catch(err => {
    console.log(err);
    // toastError = 1;
  });

  contentArray.length = 0;
  console.log(word + 'updated');
}

function syncWikiToFirebase() {
  alert('It will consume about 90 MB of Firebase DB Storage and Bandwidth. Please, Check Console!');
  storeWikiToFirebaseToggle = 1;
  loadDB();
}

// function storeWikiToFirebase(){
//   console.log('called');
// }

async function FNrawWikiPopUp(e) {
  // alert(url.id);

  var url = e.value;
  var wiki = url.split('wiki/');
  var FNcontentArray = [];

  var navTabArray = ['nav001', 'nav002', 'nav003'];
  var navTabArrayAria = ['nav001-tab', 'nav002-tab', 'nav003-tab'];
  var navTabHtml = '';
  var navBodyHtml = '';

  await fetch(wiki[0] + 'api.php?action=query&prop=revisions&titles=' + wiki[1] + '&rvprop=content&format=json&origin=*')
    .then(response => response.json())
    .then((data) => {
      var rawData = data.query.pages;
      var key = Object.keys(rawData);

      // console.log(key);
      // console.log(rawData[key].revisions[0]["*"]);

      try {
        var content = rawData[key].revisions[0]["*"];
      }
      catch (err) {
        console.log(err);
      }

      FNcontentArray.push(content);

      var workData = JSON.parse(JSON.stringify(FNcontentArray[0]).replace(/\\n/g, '<br>'));

      console.log("line 645");
      console.log(workData);

      // var kLength = Object.keys(workData).length;

      // for (var x = 0; x < kLength; x++) {
      var x = 0;

      navTabHtml += `<button class="nav-link" id="${navTabArrayAria[x]}" data-bs-toggle="tab" data-bs-target="#${navTabArray[x]}"
        type="button" role="tab" aria-controls="${navTabArray[x]}" aria-selected="true">${wiki[1]}</button>`

      navBodyHtml += `<div class="tab-pane fade p-3" id="${navTabArray[x]}" role="tabpanel" aria-labelledby="${navTabArrayAria[x]}">
                      ${workData}
                      </div>`
      // }

      document.getElementById('nav-tab').innerHTML = navTabHtml;
      document.getElementById('nav-tabContent').innerHTML = navBodyHtml;

      navTabHtml = '';
      navBodyHtml = '';
      workData.length = 0;
      FNcontentArray.length = 0;

    });

  // console.log("line 639");
  // console.log(FNcontentArray);

  const rawDataModal = new bootstrap.Modal(document.getElementById('rawdataModal'));
  rawDataModal.show();
}

function rawWikiPopUp(e) {

  var getWord = e.id;
  var WordValue = e.value;
  // .replace(/ /g,'');
  console.log(getWord);

  async function loadWiki() {

    var url = 'https://mag1000gre-default-rtdb.europe-west1.firebasedatabase.app/wordContent/' + getWord + '/contentArray.json';
    console.log(url);
    var navTabArray = ['nav001', 'nav002', 'nav003'];
    var navTabArrayAria = ['nav001-tab', 'nav002-tab', 'nav003-tab'];
    var navTabHtml = '';
    var navBodyHtml = '';

    await fetch(url)
      .then(response => response.json())
      // .then((data) => console.log(JSON.stringify(data)));
      .then((data) => {

        // Most Important Trick while dealing with JSON Data ***
        // Replace '\n' with '<br>'
        var workData = JSON.parse(JSON.stringify(data).replace(/\\n/g, '<br>'));

        // console.log(workData);
        // console.log(JSON.parse(workData));
        // console.log(workData.replace(/\\n/g, '<br>'));

        // var rawData = data.query.pages;
        // var key = Object.keys(rawData);

        // console.log(key);
        // console.log(rawData[key].revisions[0]["*"]);

        var kLength = Object.keys(workData).length;

        for (var x = 0; x < kLength; x++) {

          navTabHtml += `<button class="nav-link" id="${navTabArrayAria[x]}" data-bs-toggle="tab" data-bs-target="#${navTabArray[x]}"
          type="button" role="tab" aria-controls="${navTabArray[x]}" aria-selected="true">${x}</button>`

          navBodyHtml += `<div class="tab-pane fade p-3" id="${navTabArray[x]}" role="tabpanel" aria-labelledby="${navTabArrayAria[x]}">
                        ${workData[x]}
                        </div>`
        }

        navTabHtml += `<button class="nav-link" id="def-update" data-bs-toggle="tab" data-bs-target="#def-update-tab"
          type="button" role="tab" aria-controls="def-update-tab" aria-selected="true">Word</button>`

        navBodyHtml += `<div class="tab-pane fade p-3" id="def-update-tab" role="tabpanel" aria-labelledby="def-update">
                          Word: <b>${getWord}</b>
                          <br>
                          Synonyms: <b>${WordValue}</b>
                          <input type="text" class="form-control rounded my-4" placeholder="New Synonyms (optional)"
                            aria-describedby="basic-addon2" id='def-text'>
                          <button class="btn btn-primary" type="button" value=${getWord} id='def-btn'
                             onclick="updateWordSynonym(this)">Update</button>
                        </div>`

        document.getElementById('nav-tab').innerHTML = navTabHtml;
        document.getElementById('nav-tabContent').innerHTML = navBodyHtml;

        navTabHtml = '';
        navBodyHtml = '';
        data.length = 0;
        workData.length = 0;
        getWord = '';

        // console.log(Object.keys(data).length);
        // console.log(data);

      });
  }
  loadWiki();

  const RDmodalOpen = document.getElementById('newfeatureTest');
  const rawDataModal = new bootstrap.Modal(document.getElementById('rawdataModal'));
  // const modalClose = document.getElementById('close-modal');
  rawDataModal.show();
}

async function updateWordSynonym(e) {

  var getWord = e.value;
  var udSynonym = document.getElementById('def-text').value;

  await firebase.database().ref('words/' + getWord).update({
    udSynonym
  }).catch(err => {
    console.log(err);
    toastError = 1;
  });

  toastCall();

  document.getElementById('def-text').value = '';
  // Line 532: Set Button Value
  document.getElementById(getWord).value = udSynonym;
  // Line 528 Div . Does not change in view but updates
  // document.getElementsByName(getWord).innerHTML = udSynonym;
}

function terminateSearch() {
  terminate = 1;
}