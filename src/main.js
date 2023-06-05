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


