import { ElementFinder, ElementArrayFinder, element, by, WebElement } from 'protractor';

// Page Object
import { BasePage } from './base.po';

export class PipelinePage extends BasePage {
    // Page-level Elements
    pageTitle: ElementFinder;
    pipelineTable: ElementFinder;
    pipelineTableCard: ElementFinder;
    pipelineResults: ElementFinder;

    // ------------------------------ Init ------------------------------

    constructor() {
        super();

        this.pageTitle = element(by.id(`mfPageTitle`));
        this.pipelineTable = element(by.id(`pipelineTable`));
        this.pipelineTableCard = element(by.id('pipelineTableCard'));

    }

    // ------------------------------------------------------------

    // Checks that all actual items match all expected items
    checkAllMatch(
        actualItems: string[],
        expectedItems: { [key: string]: string }[],
        matcher: string
    ) {
        return actualItems.every((value: string, index: number) => {
            return value.trim() === expectedItems[index][matcher];
        });
    }

    // Gets all of the column names within a table
    async getTableColumns(table: ElementFinder): Promise<string[]> {
        const columns: ElementArrayFinder = table
            .element(by.css(`thead tr`))
            .all(by.css(`th.mat-header-cell`))
            .all(by.css(`.column-header-content span`));

        const colNames: any = await columns.getText();

        return colNames as Array<string>;
    }

    // Gets all of the column names within a table
    async getGridColumns(table: ElementFinder): Promise<string[]> {
        const columns: ElementArrayFinder = table
            .element(by.css(`thead tr`))
            .all(by.css(`th.mat-header-cell`))
            .all(by.css(`.column-header-content span`));

        const colNames: any = await columns.getText();

        return colNames as Array<string>;
    }

    waitForCssClass(elementFinder, desiredClass) {
        return function () {
            return elementFinder.getAttribute('class').then(function (classValue) {
                return classValue && classValue.indexOf(desiredClass) >= 0;
            });
        };
    };
}