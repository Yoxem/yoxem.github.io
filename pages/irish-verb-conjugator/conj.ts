var conjNoList = (<HTMLInputElement> document.getElementById('conj-no'));
var conjOptDiv = document.getElementById('conj1-opt-div');
var startConj = document.getElementById('start-conjugate');
var original = (<HTMLInputElement> document.getElementById('original'));
var conjStem = (<HTMLInputElement> document.getElementById('conj-stem'));

var conj_no = parseInt(conjNoList.value);
var type_of_conj1 = null;

var typesOfConj1Rads = document.getElementsByName("types-of-conj1");


// reset the dropdown list and the 1st conj opt div while refreshing the page.
window.addEventListener('pageshow', function(event) {
  conjNoList.value = "1";
  conjOptDiv.style.display = "block";
});


for(var i = 0; i < typesOfConj1Rads.length; i++) {
  let radValue = (<HTMLInputElement> typesOfConj1Rads[i]).value;
  typesOfConj1Rads[i].addEventListener('change',  () => {
    type_of_conj1 = radValue;
  })
}

conjNoList.addEventListener('change', (event) => {
  conj_no = parseInt(conjNoList.value);
  if (conj_no == 2) {
    conjOptDiv.style.display = "none";
  } else {
    conjOptDiv.style.display = "block";
  }
})

function emptyString(str : string){
  var isContainedSpace = str.match(/^[　 \t\n\r]+$/);
  var isReallyEmpty = (str == "");
  return isReallyEmpty || isContainedSpace;
}

startConj.addEventListener('click', (event) => {
  var original_text = original.value;
  var conjstem_text = conjStem.value;
  if (emptyString(original_text) && emptyString(conjstem_text)){
    alert("您輸入的是空字串或空白字元，請重新輸入。")
  }
  else{
    if (emptyString(conjstem_text)){
      conjstem_text = original_text;
    };
    generateConj(original_text, conjstem_text, conj_no);
}});

function checkedIfBroadEnd(str_array : string[]){
  for (var i = str_array.length - 1; i >=0; i--){

    if (str_array[i].match(/[aouáóúAOUÁÓÚ]/)){
      return true;
    }
    else if (str_array[i].match(/[eiéíEIÉÍ]/)){
      return false;
    }
  }
  return true;
}

let first_conj =
{ "broad" :
  {
  "pres" : ["aim", "air", "ann", "aimíd", "ann sibh", "aid", null, "tar"],
  "past" : ["as", "ais", null, "amair", "abhair", "adar", null, "adh"],
  "pa_ha" : ["ainn", "tá", "adh", "aimís", "adh sibh", "aidís", "taí"],
  "futu" : ["fad", "fair", "faidh", "faimíd", "faidh sibh", "faid", "far"],
  "cond" : ["fainn", "fá", "fadh", "faimís", "fadh sibh", "faidís", "faí"],
  "pr_su" : ["ad", "air", "aidh", "aimíd", "aidh sibh", "aid", null],
  "impe" : ["aim", null, "adh", "aimís", "aidh", "aidís", null],
  },
  "slender" :
  {
  "pres" : ["im", "ir", "eann", "imíd", "eann sibh", "id", null, "tear"],
  "past" : ["eas", "is", null, "eamair", "eabhair", "eadar", null, "eadh"],
  "pa_ha" : ["inn", "teá", "eadh", "imís", "eadh sibh", "idís", "tí"],
  "futu" : ["fead", "fir", "fidh", "fimíd", "fidh sibh", "fid", "fear"],
  "cond" : ["finn", "feá", "feadh", "fimís", "feadh sibh", "fidís", "fí"],
  "pr_su" : ["ead", "ir", "idh", "imíd", "idh sibh", "id", null],
  "impe" : ["im", null, "eadh", "imís", "idh", "idís", null],
  }
}

let second_conj =
{ "broad" :
  {
  "pres" : ["aím", "aír", "aíonn", "aímíd", "aíonn sibh", "aíd", null, "aítear"],
  "past" : ["aíos", "aís", null, "aíomair", "aíobhair", "aíodar", null, "aíodh"],
  "pa_ha" : ["aínn", "aíteá", "aíodh", "aímís", "aíodh sibh", "aídís", "aítí"],
  "futu" : ["ód", "óir", "óidh", "óimíd", "óidh sibh", "óid", "ófar"],
  "cond" : ["óinn", "ófá", "ódh", "óimís", "ódh sibh", "óidís", "ófaí"],
  "pr_su" : ["aíod", "aír", "aídh", "aímíd", "aídh sibh", "aíd", null],
  "impe" : ["aím", null, "aíodh", "aímís", "aídh", "aídís", null],
  },
  "slender" :
  {
    "pres" : ["ím", "ír", "íonn", "ímíd", "íonn sibh", "íd", null, "ítear"],
    "past" : ["íos", "ís", null, "íomair", "íobhair", "íodar", null, "íodh"],
    "pa_ha" : ["ínn", "íteá", "íodh", "ímís", "íodh sibh", "ídís", "ítí"],
    "futu" : ["eod", "eoir", "eoidh", "eoimíd", "eoidh sibh", "eoid", "eofar"],
    "cond" : ["eoinn", "eofá", "eodh", "eoimís", "eodh sibh", "eoidís", "eofaí"],
    "pr_su" : ["íod", "ír", "ídh", "ímíd", "ídh sibh", "íd", null],
    "impe" : ["ím", null, "íodh", "ímís", "ídh", "ídís", null],
  }
}

var ighType;

// values for ighType
let shortVowelEnd = 0;
let longBroadEnd = 1;
let longSlenderEnd = 2;

let firstConjIgh = 
{ 0 : // shortVowelEnd
  {
  "pres" : ["ím", "ír", "íonn", "ímíd", "íonn sibh", "íd", null, "itear"],
  "past" : ["íos", "ís", null, "íomair", "íobhair", "íodar", null, "íodh"],
  "pa_ha" : ["ínn", "iteá", "íodh", "ímís", "íodh sibh", "ídís", "ití"],
  "futu" : ["ífead", "ífir", "ífidh", "ífimíd", "ífidh sibh", "ífid", "ífear"],
  "cond" : ["ífinn", "ífeá", "ífeadh", "ífimís", "ífeadh sibh", "ífidís", "ífí"],
  "pr_su" : ["íod", "ír", "ídh", "ímíd", "ídh sibh", "íd", null],
  "impe" : ["ím", null, "íodh", "ímís", "ídh", "ídís", null],
  },
  1 : // longBroadEnd
  {
  "pres" : ["im", "ir", "nn", "imíd", "nn sibh", "id", null, "tar"],
  "past" : ["s", "is", null, "mair", "bhair", "dar", null, "dh"],
  "pa_ha" : ["inn", "iteá", "dh", "imís", "dh sibh", "idís", "ití"],
  "futu" : ["fad", "fair", "faidh", "faimíd", "faidh sibh", "faid", "far"],
  "cond" : ["fainn", "fá", "fadh", "faimís", "fadh sibh", "faidís", "faí"],
  "pr_su" : ["d", "ir", "idh", "imíd", "idh sibh", "id", null],
  "impe" : ["im", null, "dh", "imís", "idh", "idís", null],
  },
  2 : // longSlenderEnd
  {
  "pres" : ["im", "ir", "ann", "imíd", "ann sibh", "id", null, "tear"],
  "past" : ["as", "is", null, "amair", "abhair", "adar", null, "adh"],
  "pa_ha" : ["inn", "iteá", "adh", "imís", "adh sibh", "idís", "tí"],
  "futu" : ["ifead", "ifir", "ifidh", "ifimíd", "ifidh sibh", "ifid", "ifear"],
  "cond" : ["ifinn", "ifeá", "ifeadh", "ifimís", "ifeadh sibh", "ifidís", "ifí"],
  "pr_su" : ["ad", "ir", "idh", "imíd", "idh sibh", "id", null],
  "impe" : ["im", null, "adh", "imís", "idh", "idís", null],
  }
}

function generateConj(orig_txt : string, stem_txt : string, conj_no : Number){
  var impe_ls = document.getElementById("impe");
  var past_ls = document.getElementById("past");
  var _2sgimpe = impe_ls.getElementsByTagName("td")[2];
  var _3sgpast = past_ls.getElementsByTagName("td")[3];
  _2sgimpe.innerHTML = orig_txt;
  _3sgpast.innerHTML = orig_txt;


  //  Gael => ['G', 'ae', 'l']; ithim => [i, th]
  function split_text(txt : string){
    return txt.split(/([aA][eE]|[bcdfgmpstBCDFGMPST][hH]|[A-Za-z])/).filter(text => text);
  }

  var isBroadEnd;

  if (conj_no == 1){

    var stem_txt_splitted = split_text(stem_txt);
    checkedIfBroadEnd(stem_txt_splitted);

    if (type_of_conj1 == "igh"){
      if (!orig_txt.match('[iI][gG][hH]$')){
        alert("原來的詞不以 -igh 結尾。");
      }

      if (stem_txt.match('([áóúÁÓÚ]|[eE][oO]|[uU][aA])$')){
        ighType = longBroadEnd;
      }
      else if (stem_txt.match('[éÉ]$')){
        ighType = longSlenderEnd;
      }else{
        ighType = shortVowelEnd;
      }


      var suffixTable = firstConjIgh[ighType];
    
      fillTablesInner(suffixTable);
      



    
    }  
    else if (type_of_conj1 == "ail"){

      if (!orig_txt.match('[áÁ][iI][lL]$')){
         alert("原來的詞不以 -áil 結尾。");
      }

      firstConjFillTheArray();
      

      // convert stem -ál to -áil
      var stemAilLeft = stem_txt.substring(0, stem_txt.length-1);
      var stemAil;
      if (stemAilLeft.substring(stemAilLeft.length-1) == 'á'){
        stemAil = stemAilLeft + 'i' + stem_txt.substring(stem_txt.length-1);
      }
      else{
        stemAil = stemAilLeft + 'I' + stem_txt.substring(stem_txt.length-1);
      }
      
      var autoPres = document.getElementById("pres").getElementsByTagName("td")[8];
      var _2SgPaHa = document.getElementById("pa_ha").getElementsByTagName("td")[2];
      var autoPaHa = document.getElementById("pa_ha").getElementsByTagName("td")[7];

      var suffixTable = first_conj["slender"];
      var autoPresSuffix = suffixTable["pres"][7];
      var _2sgPaHaSuffix = suffixTable["pa_ha"][1];
      var autoPaHaSuffix = suffixTable["pa_ha"][6];

      autoPres.innerHTML = stemAil + autoPresSuffix;
      _2SgPaHa.innerHTML = stemAil + _2sgPaHaSuffix;
      autoPaHa.innerHTML = stemAil + autoPaHaSuffix;

    }
    
    else{

      // general 1st vonj verbs
      firstConjFillTheArray();

      // irreagularity of the pres. auto. form of lean
      if (stem_txt == "lean"){
        var relPres = document.getElementById("pres").getElementsByTagName("td")[7];
        relPres.innerHTML = "leanas";
      }
    }
  
  }
  // conj_no == 2
  else{

    
    // remove the -(a)igh of orig. text as the stem txt
    if (orig_txt.match(/.*[aA]?[iI][gG][hH]$/)){
      console.log("matched!");
      stem_txt = /(.*?)[aA]?[iI][gG][hH]/.exec(orig_txt)[1];
    }
    console.log(stem_txt);

    var stem_txt_splitted = split_text(stem_txt);
    isBroadEnd = checkedIfBroadEnd(stem_txt_splitted);

    var suffixTable;
    if (isBroadEnd) {
      suffixTable = second_conj["broad"];
    } else {
      suffixTable = second_conj["slender"];
    }
    
    
    
    fillTablesInner(suffixTable);
  }
  

  // general 1st vonj verbs
  function firstConjFillTheArray() {
    var suffixTable;
    if (isBroadEnd) {
      suffixTable = first_conj["broad"];
    } else {
      suffixTable = first_conj["slender"];
    }

    fillTablesInner(suffixTable);
  }

  function fillTablesInner(suffixTable : any) {
    var suffixTableKeys = Object.keys(suffixTable);
    
    for (var i = 0; i < suffixTableKeys.length; i++) {
      var currentSuffixTableKey = suffixTableKeys[i];
      var personalArray = document.getElementById(currentSuffixTableKey);

      for (var j = 0; j < suffixTable[currentSuffixTableKey].length; j++) {
        var item = personalArray.getElementsByTagName("td")[1 + j];
        var currentSuffix = suffixTable[currentSuffixTableKey][j];

        if (currentSuffix != null) {
          item.innerHTML = stem_txt + currentSuffix;
        }

        }

      }
  }

}
