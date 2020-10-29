import { Then, When } from 'cucumber';
import { ElementFinder, browser, protractor, by, element, ElementArrayFinder } from 'protractor';

// Page Objects
import { PipelinePage } from '../pages/pipeline.po';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const page: PipelinePage = new PipelinePage();
const EC = protractor.ExpectedConditions;
let firstRowChevron: ElementFinder = null;

Then(/^Each Opportunity ID I am able to expand collapse a drawer$/, async table => {
    const pipelineResults: ElementFinder = page.pipelineTableCard;
    await browser.wait(EC.visibilityOf(pipelineResults)).then(async function () {
        const pipelineResultsTable: ElementFinder = page.getParticularElementById(
            `pipelineResultsTableContent`
        );
        firstRowChevron = page.getChildElementAtIndexWithTextByCss(
            pipelineResultsTable,
            `.mat-icon.mf-expansion-indicator`,
            'expand_more',
            0
        );
        await browser.wait(EC.elementToBeClickable(firstRowChevron), 12000, 'firstRowChevron');
        await firstRowChevron.click();
        const quoteResultsTable: ElementFinder = page.getParticularElementById('quoteResultsTable-0');
        await browser.wait(EC.visibilityOf(quoteResultsTable)).then(async function () {
            const expectedColumns = table.hashes();
            await page.getGridColumns(quoteResultsTable).then(actualCols => {
                expect(actualCols.length).to.equal(expectedColumns.length);
                page.checkAllMatch(actualCols, expectedColumns, 'column');
            });
        });
    });
});
