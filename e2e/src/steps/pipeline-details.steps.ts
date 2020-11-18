import { Then, When } from 'cucumber';
import {
    ElementFinder,
    browser,
    protractor,
    by,
    element,
    ElementArrayFinder
} from 'protractor';

// Page Objects
import { PipelinePage } from '../pages/pipeline.po';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const page: PipelinePage = new PipelinePage();
const EC = protractor.ExpectedConditions;

Then(/^I can see an updated table displaying all opportunities$/, async table => {
    const pipelineResults: ElementFinder = page.pipelineTableCard;
    await browser.wait(EC.visibilityOf(pipelineResults), 20000).then(async function () {
        const expectedColumns = table.hashes();
        await page.getGridColumns(pipelineResults).then(actualCols => {
            expect(actualCols.length).to.equal(expectedColumns.length);
            page.checkAllMatch(actualCols, expectedColumns, 'column');
        });
    });
});

Then(/^I can see three new, separate tabs called "New", "Extension", "Awaiting Approval"$/, { timeout: 20000 }, async () => {
    await browser.wait(EC.visibilityOf(page.pipelineTableCard), 20000);
    // checks for the first tab name
    const newTab: ElementFinder = page.getParticularElementById(`mat-tab-label-0-0`);
    await browser.wait(EC.visibilityOf(newTab), 12000, 'newTab');
    const newTabName = newTab.element(by.css('.mat-tab-label-content'));
    await browser.wait(EC.visibilityOf(newTabName), 12000, 'newTabName');
    await expect(newTabName.getText()).to.eventually.include('New');

    // checks for the Second tab name
    const extensionTab: ElementFinder = page.getParticularElementById(`mat-tab-label-0-1`);
    await browser.wait(EC.visibilityOf(extensionTab), 12000, 'extensionTab');
    const extensionTabName = extensionTab.element(by.css('.mat-tab-label-content'));
    await browser.wait(EC.visibilityOf(extensionTabName), 12000, 'extensionTabName');
    await expect(extensionTabName.getText()).to.eventually.include('Extension');

    // checks for the Third tab name
    const approvalTab: ElementFinder = page.getParticularElementById(`mat-tab-label-0-2`);
    await browser.wait(EC.visibilityOf(approvalTab), 12000, 'approvalTab');
    const approvalTabName = approvalTab.element(by.css('.mat-tab-label-content'));
    await browser.wait(EC.visibilityOf(approvalTabName), 12000, 'approvalTabName');
    await expect(approvalTabName.getText()).to.eventually.include('Awaiting Approval');
});

Then(/^I access the pipeline table under the New tab$/, { timeout: 20000 }, async () => {
    const newTab: ElementFinder = page.getParticularElementById(`mat-tab-label-0-0`);
    await browser.wait(EC.visibilityOf(newTab), 12000, 'newTab');
    await newTab.click();
});

Then(/^I access the pipeline table under the tab "Extension"$/, { timeout: 20000 }, async () => {
    const extensionTab: ElementFinder = page.getParticularElementById(`mat-tab-label-0-1`);
    await browser.wait(EC.visibilityOf(extensionTab), 12000, 'extensionTab');
    await extensionTab.click();
});

Then(/^I access the pipeline table under the tab "Awaiting Approval"$/, { timeout: 20000 }, async () => {
    const approvalTab: ElementFinder = page.getParticularElementById(`mat-tab-label-0-2`);
    await browser.wait(EC.visibilityOf(approvalTab), 12000, 'approvalTab');
    await approvalTab.click();
});

Then(/^I select the Pipeline Refresh icon and I am able to see how recently the pipeline was refreshed with the language Refreshed with time changes$/, { timeout: 20000 }, async () => {
    const refreshBtn: ElementFinder = page.getParticularElementById(`refreshBtn`);
    await browser.wait(EC.visibilityOf(refreshBtn), 12000, 'approvalTab');
    const lastUpdatedTime = page.getParticularElementById(`lastUpdatedValue`).getText();
    await refreshBtn.click();
    const expectedUpdatedValue: ElementFinder = page.getParticularElementById(`lastUpdatedValue`);
    await expect(expectedUpdatedValue.getText()).to.not.equal(lastUpdatedTime);
});