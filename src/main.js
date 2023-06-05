
function externalLinks(){
  const desiredTags = "link, img, video, audio,script, iframe, source, embed"
  const links = Array.prototype.map.call(document.querySelectorAll(desiredTags),
    (HTMLtag) => { 
      return HTMLtag.href || HTMLtag.src; 
    }
  )
  return {"links": links, "count": links.length};
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.method) {
      case "connections":
        sendResponse({ 
          data: externalLinks() 
        });
        break;

      case "localStorage":
        sendResponse({ 
          data: Object.entries(localStorage) 
        });
        break;
 
      case "sessionStorage":
        sendResponse({ 
          data: Object.entries(sessionStorage) 
        });
        break;

      default:
        sendResponse({ 
          data: null 
        });
    }
  });

async function getActiveTab(){
  return await browser.tabs.query({currentWindow: true, active: true});
}
var currentTab = getActiveTab().then((tabs) => {
  const connections = getThirdPartyConnections([...tabs]);
  const sessionStorage = getSessionStorage([...tabs]);
  const localStorage = getLocalStorage([...tabs]);
  const score = getScore(connections, sessionStorage, localStorage);
});
// ----------------------------------------------------------------------------------------
async function getSessionStorage(tabs){
  const tab = tabs.pop();
  const listenners = await browser.tabs.sendMessage(tab.id, {method: "sessionStorage"});
  var score_session= document.getElementById('SessionS');
  score_session.innerHTML = 'Storage Session: ' + listenners.data.length;
  console.log("SessionStorage executed!");

  return listenners.data.length
}
// ----------------------------------------------------------------------------------------
async function getLocalStorage(tabs){
    const tab = tabs.pop();
    const listenners = await browser.tabs.sendMessage(tab.id, {method: "localStorage"});
    var score_local = document.getElementById('LocalS');
    var score_real_local = 20;
    score_local.innerHTML = "Data Storage: " + listenners.data.length;
    return listenners.data.length;
}
// ----------------------------------------------------------------------------------------
async function getThirdPartyConnections(tabs){
  const tab = tabs.pop();
  const listenners = await browser.tabs.sendMessage(tab.id, {method: "connections"});
  const all_connections = listenners.data.count;
  var score_connections = document.getElementById('Connect');    
  score_connections.innerHTML ="Third Party Connections: "+ parseInt(all_connections*0.1);  
  return all_connections*0.1;
}
// ----------------------------------------------------------------------------------------
async function getScore(a, b, c){
  a = await a;
  b = await b;
  c = await c;
  let score = (1/(0.5*a+ 10*b+5*c))*1000;
  if (score > 100) score = 100;
  else if (score < 0) score = 0;
  else score = score.toFixed(2);
  var scoreElement = document.getElementById('score');
  scoreElement.innerHTML = "Overall: " + score;
  
}
// ----------------------------------------------------------------------------------------
function coockies(tabs) {
  let tab = tabs.pop();

  let firstPartyAmount = 0;
  let thirdPartyAmount = 0;
  let sessionAmount = 0;
  let navigationAmount = 0;

  let allCookies = browser.cookies.getAll({ url: tab.url });

  allCookies.then((cookies) => {
    if (cookies.length > 0) {
      for (let cookie of cookies) {
        tab.url.includes(cookie.domain)
          ? firstPartyAmount++
          : thirdPartyAmount++;
        cookie.session != undefined ? sessionAmount++ : navigationAmount++;
      }
      let total_element = document.getElementById('cookie-master');
      total_element.innerHTML ="Total Cookies: "+ cookies.length;

      let firts_element = document.getElementById('cookies-first-party-amount');
      firts_element.innerHTML ="First party: "+ firstPartyAmount;
      let third_element = document.getElementById('cookies-third-party-amount');
      third_element.innerHTML ="Third party: "+ thirdPartyAmount;
      let navigation_element = document.getElementById('cookies-navigation-amount');
      navigation_element.innerHTML ="Navigation: "+ navigationAmount;
    }
    else {
      let total_element = document.getElementById('cookie-master');
      total_element.innerHTML ="Cookies: ";
      let firts_element = document.getElementById('cookies-first-party-amount');
      firts_element.innerHTML ="No cookies found";


    }
  });
  return cookies.length;
}

browser.tabs.query({ currentWindow: true, active: true }).then(coockies);


