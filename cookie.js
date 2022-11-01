// Official cookie clicker stats like cookies per second and the names of each building were used in this project

// Maybe I should get the weird upgrades like "miner grandmas" or the one that makes autoclickers do 0.1 more per other building bought to make the lower ones still kind of viable

var total = 0;
var hCPS = 0;
var tCPS = 0;
var click = 1; // how many cookies are awarded per click
var buildingCPS = [0.1, 1, 8, 47, 260, 1400, 7800, 44000, 260000, 1600000, 10000000]; // how much each building makes every second (divided to make it update more in recount and cycle)
var buildingCount = []; // an array with the amounts of each building that determines both the new hCPS (through recount()) and the new cost of the building, through some exponential function
var buildingCost = [15, 100, 1100, 12000, 130000, 1400000, 20000000, 330000000, 5100000000, 75000000000, 1000000000000]; // how much each building purchase costs
var orgBuildingCost = [15, 100, 1100, 12000, 130000, 1400000, 20000000, 330000000, 5100000000, 75000000000, 1000000000000]; // how much each building purchase costs at the beginning, for better exponential stuff
var upgradeCount = []; // how many of upgrade you have; one offset from the others because you can upgrade the click
var upgradeCost = [100, 1000, 11000, 120000, 1300000, 14000000, 200000000, 3300000000, 51000000000, 750000000000, 10000000000000]; // how much each upgrade costs originally; same offset
var buildingName = ["auto", "gran", "farm", "mine", "fact", "bank", "temp", "wiza", "ship", "alch", "port"]; // makes retrieving each id from the html much easier, as to make changing the cost easier as well
var ran = false; // for htmlSet(), makes it so it'll go the first time but not after that
var cyc;
var cookieCost = 100000;
var cosmoandwanda = ["Chocolate Chip", "Sugar", "Macadamia Nut", "White Chocolate Chip", "Double Chocolate Chip", "Peanut Butter",
                    "Super Sugar", "Deluxe Chocolate", "Triple Chocolate Chip", "Bronze", "Silver", "Gold", "Diamond",
                    "Uncommon", "Rare", "Epic", "Legendary", "Mystic", "Cheese", "Double Cheese", "Crypto", "Wood",
                    "Play Button", "Disturbed", "The Big Cheese", "Screaming", "Soggy", "Max"]; // just for fun, in the cookie upgrade thing
var cookieLvl = 1; // for cosmetic purposes
var bonus = 1; // cookie bonus, both click and hCPS times this every time // unneeded
var upgradeCycle = [10, 100, 1000, 10000, 100000]; // for the price increases of the upgrades

// upgrade cookies; basically, every time cycle() is ran, total += hCPS * bonus;
// or tCPS and hCPS have bonus built into them in recount()
// cookie upgrades scale very quickly, much more than building upgrades
// also only adds like 0.1 or something to the bonus

// when you reach a certain CPS (or maybe purchase a certain building), reveal another building. A few in advance, of course.

function buy(x) { // purchasing a new item, x determines the type bought
  if (total >= buildingCost[x] & !document.getElementById(buildingName[x] + "Purchase").classList.contains("locked")) {
    total -= buildingCost[x];
    buildingCount[x]++;
    buildingCost[x] = parseInt(orgBuildingCost[x] * Math.pow(1.15, buildingCount[x])); // exponential increase // I could probably do a larger number than that (currently 1.3). it doubles, right?
    document.getElementById(buildingName[x] + "Cost").innerHTML = buildingCost[x];
    // could do a buyMax thing that essentially does a while loop of this, going until there isn't enough money in your total
  }
  recount(); // reset the hCPS because more stuff was added to it
}

// I am so pumped oh my word
// WOOOOOOOOOOOOO
// AND ALL FOR NOTHINGQWU ?AEJ.SDZGLIHA
function upgrade(x) {
  var v = 0;
  var g = 2;
  var h = upgradeCount[x];
  var allow = false
  if (buildingCount[x] > 0) { allow = true; } // can't upgrade if you don't have at least one building purchased already
  if (x == 0) { allow == true; }
  if (total >= upgradeCost[x] & allow == true) {
    total -= upgradeCost[x];
    for (var i = 3; i <= upgradeCount[x]; i++) { // YYYYYYYYYYEEEEEEEEEEEEEEEEEEEEEEEEEEEEEAAAAAHHHHHH WOOOOOOOOOOOOOOOOOO
      if (upgradeCount[x] > g) {
        v++;
        g+= i;
      }
    }
    upgradeCount[x]++;
    upgradeCost[x] *= upgradeCycle[v]; // multiplied by 5, then 10, then 100, then 1000 and etc.
    if (upgradeCount[x] == 2) { upgradeCost[x] /= 2; } // 2 (1 1) 3 4 5
    if (x == 0) {
      click *= 2;
    }
    buildingCPS[x] *= 2;
  }
  recount();
}

function cookieUpgrade() { // making the cookie worth more in all aspects
  cookieCost = 100000 * Math.pow(5, (cookieLvl - 1));
  if (total >= cookieCost & cookieLvl < cosmoandwanda.length) {
    total -= cookieCost;
    // bonus += 0.5;
    cookieLvl++;
    cookieCost = 100000 * Math.pow(5, (cookieLvl - 1));
  }
  recount();
}

function clickCookie() { // clicking the cookie
  total += (click * (1 + (0.5 * (cookieLvl - 1))));
  document.getElementById("totalDisplay").innerHTML = parseInt(total);
}

function cycle() { // adding cookies per fractional second (hCPS) and displaying the new cookie count
  total += hCPS;
  document.getElementById("totalDisplay").innerHTML = parseInt(total);
  /* Ok, for some reason the timing is off
    It's not giving cookies at the rate described, it's either slow or fast, however slight it may be
    I think it's good now since I just reduced it to 100 times a second as opposed to 1000
  */
}

function recount() { // finding the proper hCPS count after each purchase
  tCPS = 0; // reset to make the for loop easier
  hCPS = 0; // I technically don't need this but i'm keeping it anyway
  for (var i = 0; i < buildingCPS.length; i++) {
    tCPS += (buildingCPS[i] * buildingCount[i]) * (1 + (0.5 * (cookieLvl - 1)));
  }
  hCPS = tCPS / 100;
  document.getElementById("CPSDisplay").innerHTML = tCPS.toFixed(1); // toFixed() from https://www.jsdiaries.com/how-to-remove-decimal-places-in-javascript/ just to make it display better numbers
  document.getElementById("totalDisplay").innerHTML = parseInt(total);
  htmlSet(true); // since everything calls recount, which resets the CPS and displays the new total, this also resets the html displays, which happens every time
}

function htmlSet(x) { // all of this is for initial setup, especially at the start
  if (x == false) {
    setInterval(cycle, 10); // sets up the cookies per second
    for (var i = 0; i < buildingName.length; i++) { // I don't wanna do this manually so i got the code to do it for me
      buildingCount.push(0);
      upgradeCount.push(1);
    }
    console.log("|-- No cheating pretty please! --|");
  }
  for (var i = 0; i < buildingName.length; i++) {
    document.getElementById(buildingName[i] + "Cost").innerHTML = buildingCost[i]; // setting the html to show the (new) costs of the buildings
    document.getElementById(buildingName[i] + "CPS").innerHTML = (buildingCPS[i] * (1 + (0.5 * (cookieLvl - 1)))).toFixed(1); // (new) CPS
    document.getElementById(buildingName[i] + "Amt").innerHTML = buildingCount[i]; // (new) counts
    document.getElementById(buildingName[i] + "Upg").innerHTML = upgradeCost[i];
    document.getElementById(buildingName[i] + "Lvl").innerHTML = upgradeCount[i];
  }
  document.getElementById("current").innerHTML = cosmoandwanda[cookieLvl - 1];
  document.getElementById("cookieLvl").innerHTML = cookieLvl;
  if (cookieLvl == cosmoandwanda.length) { // level cap, so you don't just run out of the fun cookie upgrade names
    document.getElementById("cookieLvl").innerHTML += "; Max Level";
    document.getElementById("noUpgrade").innerHTML = "";
    document.getElementById("noCost").innerHTML = "";
  } else {
    document.getElementById("cookieUpg").innerHTML = cookieCost;
    document.getElementById("cosmeticCookie").innerHTML = cosmoandwanda[cookieLvl];
  }
  for (var i = 0; i < buildingName.length; i++) {
    if (tCPS < (buildingCPS[i] / 2) & i != 0) {
      document.getElementById(buildingName[i] + "Purchase").classList.add("locked");
    } else if (document.getElementById(buildingName[i] + "Purchase").classList.contains("locked")) {
      document.getElementById(buildingName[i] + "Purchase").classList.remove("locked");
    }
    if (buildingCount[i] == 0) {
      document.getElementById(buildingName[i] + "Upgrade").classList.add("locked");
    } else if (document.getElementById(buildingName[i] + "Upgrade").classList.contains("locked")) {
      document.getElementById(buildingName[i] + "Upgrade").classList.remove("locked");
    }
  }
  document.getElementById("cookie").src = cosmoandwanda[cookieLvl - 1] + ".png";
}
