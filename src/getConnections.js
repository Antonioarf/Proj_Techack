async function getActiveTab(){
    return await browser.tabs.query({currentWindow: true, active: true});
}

async function getThirdPartyConnections(tabs){
    const tab = tabs.pop();
    const listenners = await browser.tabs.sendMessage(tab.id, {method: "connections"});
    const all_connections = listenners.data.count;
    var score_connections = document.getElementById('Connect');    

        score_connections.innerHTML ="Third Party Connections: "+ parseInt(all_connections*0.1);
        let scoreFinal = parseInt((1/parseInt(all_connections*0.1))*1000);
        var scoreElement = document.getElementById('score');
        scoreElement.innerHTML = "Overall: " + scoreFinal;
    
}

var currentTab = getActiveTab().then((tabs) => {
    const connections = getThirdPartyConnections([...tabs]);
});