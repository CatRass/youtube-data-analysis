(() => {
    waitForElm('#progress').then((elm) => {
        console.log('Element is ready');
        historyLoaded();
    });

    const historyLoaded = () => {
        var lastNumVideosLoaded = 0;
        var currentNumVideosLoaded = 0;
        console.log("Before: Current:" + currentNumVideosLoaded + ", last:" + lastNumVideosLoaded);
        while (true) {
            var loadedThumbs = document.querySelectorAll("[id=thumbnail]");
            currentNumVideosLoaded = loadedThumbs.length;
            
            console.log("During: Current:" + currentNumVideosLoaded + ", last:" + lastNumVideosLoaded);
            
            console.log(loadedThumbs);
            for (var i = 0; i < loadedThumbs.length; i++) {
                var progressInd = loadedThumbs[i].querySelector("progress");
                var vidLength = loadedThumbs[i].querySelector("[id=text]");
                console.log(progressInd);
                console.log(vidLength);
                if (progressInd && vidLength) {
                    console.log(progressInd);
                    console.log(vidLength.innerText);
                }
            }
            if (lastNumVideosLoaded == currentNumVideosLoaded) {
                return;
            }
            lastNumVideosLoaded = currentNumVideosLoaded;
            console.log("After: Current:" + currentNumVideosLoaded + ", last:" + lastNumVideosLoaded);
            loadedThumbs[loadedThumbs.length - 1].scrollIntoView(true);
            // window.scrollTo(0, document.body.scrollHeight);
            // Wait until timeout for the length of querySelectorAll('[id=progress]') to get bigger than it is currently
            waitForNodeListLengthIncrease("[id=thumbnail]", loadedThumbs.length, function(updatedNodeList) {
                console.log("NodeList length increased!");
              });
        }
        
    }

    // historyLoaded();
})();

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function waitForNodeListLengthIncrease(selector, initialLength, callback) {
    var nodeList = document.querySelectorAll(selector);
    
    if (nodeList.length > initialLength) {
      callback(nodeList);
    } else {
      var timeout = 10000; // 10 seconds timeout
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length > 0) {
            var updatedNodeList = document.querySelectorAll(selector);
            if (updatedNodeList.length > initialLength) {
              clearTimeout(timeoutId); // Clear the timeout
              observer.disconnect();
              callback(updatedNodeList);
            }
          }
        });
      });
  
      var timeoutId = setTimeout(function() {
        observer.disconnect();
        console.log("Timeout reached. NodeList length did not increase within the specified time.");
        alert("failed");
      }, timeout);
  
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }