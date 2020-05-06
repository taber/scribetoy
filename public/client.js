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
  let phraseText = rawInput.replace(/[\u0591-\u05BD\u05BF-\u05C7]/g, "");
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
  $(".word").on("click", function() {
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

  if (show == "show-both") {
    $(".glyph-name").show();
    $(".glyph-display").show();
  } else if (show == "show-letters") {
    $(".glyph-display").show();
    $(".glyph-name").hide();
  } else {
    $(".glyph-name").show();
    $(".glyph-display").hide();
  }
}

function getFromSefaria(ref) {
  url = "https://www.sefaria.org/api/texts/" + ref + "?language=he&context=0&version=Tanach%20with%20Text%20Only";
  $.get(url, function(data) {
    //console.log(data);
    $('#input-text').val(data.he);
    builder();
    styler();
    let h = "<strong>" + data.ref + " (" + data.heRef + "):</strong> " + data.text;
    $('#reference-display').html(h);
  });
}

// TODO: change everything ohmigod this MESS but it WORKS so!!!
$(document).ready(function() {
  builder();
  styler();
  $("#input-text").on("change", function() {
    builder();
  });
  $('#input-text').on('keyup', builder);
  $("form").on("change", function() {
    styler();
  });

  $(".word").on("click", function() {
    $(this).toggleClass("done");
  });

  $("#grab").on("click", function() {
    event.preventDefault();
    let book = $("#book-select").val();
    let passage = $("#passage-entry").val();
    $.get('/getAnything', function(data) {
      let s = getFromSefaria(data.ref);
    });
  });
});
