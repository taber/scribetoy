const letterNames = exportLetterNames();

function exportLetterNames() {
  return {
    א: "Alef",
    ב: "Bet",
    ג: "Gimel",
    ד: "Dalet",
    ה: "Hey",
    ו: "Vav",
    ז: "Zayin",
    ח: "Chet",
    ט: "Tet",
    י: "Yod",
    כ: "Kaf",
    ך: "Kaf Sofit",
    ל: "Lamed",
    מ: "Mem",
    ם: "Mem Sofit",
    נ: "Nun",
    ן: "Nun Sofit",
    ס: "Samech",
    ע: "Ayin",
    פ: "Pay",
    ף: "Pay Sofit",
    צ: "Tsade",
    ץ: "Tsade Sofit",
    ק: "Qof",
    ר: "Resh",
    ש: "Shin",
    ת: "Tav",
    "־": "Maqaf",
    "׳": "Geresh",
    "״": "Gershayim",
    "ֽ": "Meteg",
    "׃": "Sof Pasuq",
    "׆": "Nun Hafukha",
    "(": "",
    ")": ""
  };
}

class Word {
  glyphs = new Array();
  word = "";

  constructor(w) {
    this.word = w;
    let rawGlyphs = w.trim().split("");
    rawGlyphs.forEach(element => {
      if (letterNames[element] != "undefined") {
        this.glyphs.push(element);
      }
    });
  }
}


function builder() {
  $("#action-zone").empty();
  let rawInput = $("#input-text").val();

  // this does a pretty good job of zapping both niqud & cantillation marks:
  let phraseText = rawInput.replace(/[\u0591-\u05BD\u05BF-\u05C7]/g, "");
  // split by spaces but also a couple weird Biblical Hebrew separators
  let phrase = phraseText.split(/[\s…׀]/g);

  let wordList = new Array();
  phrase.forEach(element => {
    if (element != "") {
      w = new Word(element);
      wordList.push(w);
    }
  });

  wordList.forEach((element, wordNumber) => {
    let wordBlock = $('<div class="word" id="word-' + wordNumber + '">');
    wordBlock.append(
      $('<span class="word-number">' + (wordNumber + 1) + "</span>")
    );
    wordBlock.append($('<div class="word-display">' + element.word + "</div>"));
    let glyphsBlock = $('<div class="glyphs">');

    element.glyphs.forEach(elem => {
      let glyph = $('<div class="glyph">');
      glyph.append($('<span class="glyph-display">' + elem + "</span>"));
      glyph.append(
        $('<span class="glyph-name">' + letterNames[elem] + "</span>")
      );
      glyphsBlock.append(glyph);
    });

    wordBlock.append(glyphsBlock);
    $("#action-zone").append(wordBlock);
  });

  // there's a better solution than rebinding this but.... whatever for now
  $(".word").on("click", function () {
    $(this).toggleClass("done");
  });
}

function styler() {
  let a = $("main");

  let font = $('input[name="font"]:checked').val();
  let size = $('input[name="size"]:checked').val();
  let show = $('input[name="show"]:checked').val();

  a.removeClass([
    "font-modern",
    "font-classic",
    "size-normal",
    "size-bigger",
    "size-biggest"
  ]);

  a.addClass(size);
  a.addClass(font);
  
  let glyphNames = $('.glyph-name');
  let glyphDisplays = $('.glyph-display');

  if (show == "show-both") {
    glyphNames.show();
    glyphDisplays.show();
  } else if (show == "show-letters") {
    glyphNames.hide();
    glyphDisplays.show();
  } else {
    glyphNames.show();
    glyphDisplays.hide();
  }
}

function getFromSefaria(ref) {
  url = "https://www.sefaria.org/api/texts/" + ref;
  params = {
    'language':'he',
    'version':'Tanach with Text Only',
    'context':0
  };
  $.get(url, params, function (data) {
    $('#input-text').val(data.he);
    builder();
    styler();
    let h = "<strong>" + data.ref + " (" + data.heRef + "):</strong> " + data.text;
    $('#reference-display').html(h);
  });
}

// TODO: change everything ohmigod this MESS but it WORKS so!!!
$(document).ready(function () {
  
  // okay let's initialize with something but I need to fix this :P
  $.get('/getAnything', function (data) {
    let s = getFromSefaria(data.ref);
  });

  builder();
  styler();

  $("#input-text").on("change", builder);
  $('#input-text').on('keyup', builder);
  $("form").on("change", styler);

  $(".word").on("click", function () {
    $(this).toggleClass("done");
  });

  $("#grab").on("click", function () {
    event.preventDefault();
    $.get('/getAnything', function (data) {
      let s = getFromSefaria(data.ref);
    });
  });

});
