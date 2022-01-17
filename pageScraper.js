const scraperObject = {
    url: 'https://www.truecar.com/used-cars-for-sale/listings/',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('div[data-test="allVehicleListings"]');

        let urls = await page.$$eval('.vehicle-card', links => {
            links = links.map(el => el.querySelector(' a').href);

            return links;
        });

        let pagePromise = (link) => new Promise(async(resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            dataObj['carName'] = await newPage.$eval('.heading-base > .heading-2', text => text.textContent);
            dataObj['carPrice'] = await newPage.$eval('div[data-test="vdpPreProspectPrice"]', text => text.textContent);
            dataObj['carMileage'] = await newPage.$eval('.d-flex.padding-bottom-3.border-bottom > .d-flex.flex-column.margin-top-1 > .margin-top-1', text => text.textContent);
            dataObj['vinNumber'] = await newPage.$eval('p[data-test="vinNumber"]', text => text.textContent);
            dataObj['imgUrl'] = await newPage.$eval('.rounded > .img-container img', img => img.src);
            // dataObj['carTransmission'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
            // dataObj['carColor'] = await newPage.$eval('div[data-test="vdpOverviewSection"]', text => {
            //     text = text.filter(text => text.querySelector('.heading-4').textContent !== "Exterior Color")
            //     return text;
            //         //text.textContent
            // });
            resolve(dataObj);
            await newPage.close();
        });

        for(link in urls){
            let currentPageData = await pagePromise(urls[link]);
            // scrapedData.push(currentPageData);
            console.log(currentPageData);
        }
    }
}

module.exports = scraperObject;