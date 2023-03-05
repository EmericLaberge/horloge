var svg = document.getElementById("monhorloge");
var aig1 = document.getElementById("aiguille1");
var gMeteo = document.getElementById("meteo");

function ajuste(sec) {
  aig1.setAttribute("transform", "rotate(" + r + " 200 200)");
}

// ajoute un tic au grand cercle
function grandTic(rot) {
  var e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  e.setAttribute("d", "M 362 200 L 378 200 ");
  e.setAttribute("transform", "rotate(+" + rot + " 200 200)");
  e.setAttribute("fill", "none");
  e.setAttribute("stroke", "black");
  e.setAttribute("stroke-width", "5");
  svg.appendChild(e);
}

// ajoute un tic au petit cercle des secondes
function ticSec(rot) {
  var e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  e.setAttribute("d", "M 296 160 L 304 160 ");
  e.setAttribute("transform", "rotate(+" + rot + " 260 160)");
  e.setAttribute("fill", "none");
  e.setAttribute("stroke", "black");
  e.setAttribute("stroke-width", "3");
  svg.appendChild(e);
}

// ajoute un tic aux petit cercle des minutes
function ticMin(rot) {
  var e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  e.setAttribute("d", "M 176 160 L 184 160 ");
  e.setAttribute("transform", "rotate(+" + rot + " 140 160)");
  e.setAttribute("fill", "none");
  e.setAttribute("stroke", "black");
  e.setAttribute("stroke-width", "3");
  svg.appendChild(e);
}

//Ajoute les numeros des heures
function txtHeure(texte, rot) {
  var e = document.createElementNS("http://www.w3.org/2000/svg", "text");
  e.setAttribute("x", Math.cos((2 * Math.PI * (rot + 90)) / 360) * 148 + 200);
  e.setAttribute("y", Math.sin((2 * Math.PI * (rot + 90)) / 360) * 148 + 200);
  e.setAttribute("fill", "purple");
  e.setAttribute(
    "style",
    "text-anchor:middle; dominant-baseline: middle; font-family:Ubuntu; font-weight: bold; font-size:19;"
  );
  var textNode = document.createTextNode(texte);
  e.appendChild(textNode);
  svg.appendChild(e);
}

//Ajoute les numeros des minutes
function txtMin(texte, rot) {
  var e = document.createElementNS("http://www.w3.org/2000/svg", "text");
  e.setAttribute("x", Math.cos((2 * Math.PI * (rot + 90)) / 360) * 30 + 140);
  e.setAttribute("y", Math.sin((2 * Math.PI * (rot + 90)) / 360) * 30 + 160);
  e.setAttribute("fill", "blue");
  e.setAttribute(
    "style",
    "text-anchor:middle; dominant-baseline: middle; font-family:Ubuntu; font-weight: bold; font-size:9;"
  );

  //e.setAtrribute("transform","rotate(-"+rot+")");
  var textNode = document.createTextNode(texte);
  e.appendChild(textNode);
  svg.appendChild(e);
}

// Ajoute le numero des secondes
function txtSec(texte, rot) {
  var e = document.createElementNS("http://www.w3.org/2000/svg", "text");
  e.setAttribute("x", Math.cos((2 * Math.PI * (rot + 90)) / 360) * 30 + 260);
  e.setAttribute("y", Math.sin((2 * Math.PI * (rot + 90)) / 360) * 30 + 160);
  e.setAttribute("fill", "green");
  e.setAttribute(
    "style",
    "text-anchor:middle; dominant-baseline: middle; font-family:Ubuntu; font-weight: bold; font-size:9;"
  );
  var textNode = document.createTextNode(texte);
  e.appendChild(textNode);
  svg.appendChild(e);
}

// Ajoutes les points representants la meteo
function meteoDot(rot, id) {
  var e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  e.setAttribute("id", id);
  e.setAttribute("cx", "385");
  e.setAttribute("cy", "200");
  e.setAttribute("r", "6");
  e.setAttribute("transform", "rotate(+" + rot + " 200 200)");
  e.setAttribute("fill", "blue");
  e.setAttribute("stroke", "none");
  gMeteo.appendChild(e);
  return e;
}

// boucle pour generer les tics et le texte de toutes les horloges

for (var i = 0; i < 360; i += 15) grandTic(i);
for (var i = 0; i < 360; i += 30) ticSec(i);
for (var i = 0; i < 360; i += 30) ticMin(i);
for (var i = 0; i < 24; i++) txtHeure("" + i, (i * 360) / 24);
for (var i = 0; i < 12; i++) txtMin("" + i * 5, (i * 360) / 12);
for (var i = 0; i < 12; i++) txtSec("" + i * 5, (i * 360) / 12);

var meteoTab = [];
for (var i = 0; i < 24; i++)
  meteoTab[i] = meteoDot(90 + (i * 360) / 24, "meteoDot" + i);

// for(var i=0;i<24;i++) meteoTab[i].setAttribute("fill","rgb("+(i*255/23)+","+(255-i*255/23)+",255)");

//var auj = new Date();
//var fractionJour = (geth);

// fonction qui recolte les infos fourni par l'api
function meteo() {
  var url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=45.5028&lon=-73.608&&appid=0a84458e46fc2f6631563610c8e0ec74";

  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var jmeteo = JSON.parse(this.responseText);
      effetMeteo(jmeteo);
    }
  };
  req.open("GET", url, true);
  req.send();
}

function effetMeteo(jm) {
  var h = jm.hourly;

  for (var i = 0; i < 24; i++) {
    var f = h[i].clouds; //nuages
    meteoTab[i].setAttribute(
      "fill",
      "rgb(" + (f / 100) * 255 + "," + (255 - (f / 100) * 255) + ",0)"
    );
  }

  var sunRise = jm.current.sunrise;
  var sR = (myDate = new Date(sunRise * 1000));
  var hR = sR.getHours();

  var sunSet = jm.current.sunset;
  var sS = (myDate = new Date(sunSet * 1000));
  var hRS = sS.getHours();

  var circ = 2 * 170 * Math.PI;
  const usedCirc = (1 - (24 - hRS + hR) / 24) * 2 * 170 * Math.PI;
  const seg = document.getElementById("nuit");
  seg.setAttribute(
    "style",
    "stroke-dasharray: " + circ + "; stroke-dashoffset: " + usedCirc
  );
  seg.setAttribute(
    "transform",
    "rotate(" + (90 + (hRS * 360) / 24) + ",200,200)"
  );

  var phase = jm.daily[0].moon_phase;
  var lune = document.getElementById("lune");
  if (phase <= 0.5) {
    lune.setAttribute("cx", +(220 - phase * 160) + "");
  } else if (phase >= 0.5) {
    lune.setAttribute("cx", +(300 - (phase - 0.5) * 160) + "");
  }
}

// Fonction qui ajuste les aiguilles des 3 quadrants à la bonne heure
function ajusteAig() {
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();
  var fracHr = (1 / 2 + (h + m / 60 + m / 3600) / 24) * 360;
  var fracMin = 180 + 6 * m;
  var fracSec = 180 + 6 * s;
  var transHr = document.getElementById("transAigHr");
  var transMin = document.getElementById("transAigMin");
  var transSec = document.getElementById("transAigSec");

  transHr.setAttribute("from", +fracHr + " 200 200 ");
  transHr.setAttribute("to", +(fracHr + 360) + " 200 200 ");

  transMin.setAttribute("from", +fracMin + " 140 160 ");
  transMin.setAttribute("to", +(fracMin + 360) + " 140 160 ");

  transSec.setAttribute("from", +fracSec + " 260 160 ");
  transSec.setAttribute("to", +(fracSec + 360) + " 260 160 ");
}

// On ajuste l'heure lors de l'ouverture de la page
ajusteAig();

//  appelé à chaque seconde...
function mettreAJour() {
  var now = new Date();
  var y = now.getFullYear();
  var ms = now.getMonth();
  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();
  var d = now.getDate();

  var mn = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  document.getElementById("afficherDate").innerHTML =
    d + " " + mn[ms] + " " + y;
  document.getElementById("afficherHr").innerHTML = h + ":" + m + ":" + s;
}

function initialise() {
  setInterval(mettreAJour, 1000);
  setInterval(meteo(), 1000 * 60 * 5);
}

window.onload = initialise;
