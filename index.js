const puppeteer = require('puppeteer');
const path = require('path');

(async() => {
    // Use Puppeteer to launch a browser and open a page.
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    // Open the index.html file containing the shadowDOM
    await page.goto(`file:${path.join(__dirname, 'index.html')}`);

    // Create a raw DevTools protocol session to talk to the page.
    // Use CDP to set the animation playback rate.
    const session = await page.target().createCDPSession();

    // Enable CDP DOM api
    await session.send('DOM.enable');
    // Retrieve all possible nodes
    const allNodes = await session.send('DOM.getFlattenedDocument', {
        depth: -1,
        pierce: true
    });
    // Retrieve all possibles nodeIDS
    const nodeIds = allNodes.nodes.map(n => n.nodeId);

    // Try to peform DOM.querySelector on all possible nodeId
    for (nodeId of nodeIds) {
        try {
            const result = await session.send('DOM.querySelector', {
                nodeId,
                selector: "#hoverme",
            });
            console.log("Retrieved result: ");
            console.log(result);
        } catch (e) {
            console.log(`error occured: ${e.message}`);
        }
    }
    console.log("one of the result nodeId should be something else than 0");

})();
