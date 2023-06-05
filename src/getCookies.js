function main(tabs) {
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

  }
  
  browser.tabs.query({ currentWindow: true, active: true }).then(main);