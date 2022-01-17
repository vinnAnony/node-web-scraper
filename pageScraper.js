const database = require('./sqlConnection');
const scraperObject = {
    url: 'https://www.truecar.com/used-cars-for-sale/listings/',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url, {waitUntil: 'load', timeout: 0});
        // Wait for the required DOM to be rendered
        await page.waitForSelector('div[data-test="allVehicleListings"]');

        let urls = await page.$$eval('.vehicle-card', links => {
            links = links.map(el => el.querySelector(' a').href);

            return links;
        });

        let pagePromise = (link) => new Promise(async(resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link, {waitUntil: 'load', timeout: 0});
            dataObj['carName'] = await newPage.$eval('.heading-base > .heading-2', text => text.textContent);
            dataObj['carPrice'] = await newPage.$eval('div[data-test="vdpPreProspectPrice"]', text => text.textContent);
            dataObj['carMileage'] = await newPage.$eval('.d-flex.padding-bottom-3.border-bottom > .d-flex.flex-column.margin-top-1 > .margin-top-1', text => text.textContent);
            dataObj['vinNumber'] = await newPage.$eval('p[data-test="vinNumber"]', text => text.textContent);
            dataObj['imgUrl'] = await newPage.$eval('.rounded > .img-container img', img => img.src);
            resolve(dataObj);
            await newPage.close();
        });

        for(link in urls){
            let currentPageData = await pagePromise(urls[link]);
            // scrapedData.push(currentPageData);
            insertData(currentPageData);
            console.log(currentPageData);
        }
    }
}

function insertData(dataObj){
    let carName = dataObj.carName;
    let carPrice = dataObj.carPrice;
    let carMileage = dataObj.carMileage;
    let vinNumber = dataObj.vinNumber;
    let imgUrl = dataObj.imgUrl;


        let query = `INSERT INTO cars (carName, carPrice, carMileage, vinNumber, imageUrl) VALUES (?, ?, ?, ?,?);`;

    database.query(query,
            [carName, carPrice, carMileage, vinNumber, imgUrl],
            (err, rows) => {
            if (err) throw err;
            console.log("Row inserted with id = "
                + rows.insertId);
        });
}



module.exports = scraperObject;