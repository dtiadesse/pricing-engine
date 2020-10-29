/**
 * This is our Base Page Object for Pricing Engine. We'll use this object to host common functions that are
 * performed throughout our entire test automation suite.
 */

import {
    browser,
    by,
    element,
    ElementArrayFinder,
    ElementFinder,
    promise,
    WebElement,
    WebElementPromise
} from 'protractor';

export class BasePage {
    // Internal HUB Login page elements
    loginForm: ElementFinder;
    loginUserName: ElementFinder;
    loginPassword: ElementFinder;
    loginBtn: ElementFinder;

    // HUB Application Logout elements
    userProfileBtn: ElementFinder;
    logoutLink: ElementFinder;

    // PE Search Elements
    searchInput: ElementFinder;
    searchAutoComplete: ElementFinder;
    option1: ElementFinder;

    // Form-related
    /**
     * The actual value returned by WebElement.getCssValue('color') (executed in a function below) will be as the
     * browser interprets it. This means that different browsers can return different types of computed values.
     * i.e. - Chrome returns the full, computed "rgba" value.
     */
    fieldErrorColor = 'rgba(219, 58, 0, 1)';
    requiredFieldErrorMsg = 'You must enter a value';

    // ------------------------------ Init ------------------------------

    constructor() {
        this.loginForm = element(by.id('login-form'));
        this.loginUserName = this.loginForm.element(by.id('username'));
        this.loginPassword = this.loginForm.element(by.id('password'));
        this.loginBtn = this.loginForm.element(by.css('button'));

        this.userProfileBtn = element(by.id('top-profile-button'));
        this.logoutLink = element(by.css('a.logout'));

        this.searchInput = element(by.id('mfSearchFieldInput'));
        this.searchAutoComplete = element(by.id('mfSearchAutoComplete'));
        this.option1 = this.getParticularElementById('mat-option-0');
    }

    // ------------------------------ Log In ------------------------------

    async login(user: string): Promise<any> {
        await this.loginUserName.sendKeys(browser.params.login[user].uid);
        await this.loginPassword.sendKeys(browser.params.login[user].pw);
        return this.loginBtn.click() as Promise<any>;
    }

    // ------------------------------ Handle Navigation ------------------------------

    async navigateTo(subRoute?: string): Promise<any> {
        const url = subRoute ? `/pe/${subRoute}` : '/pe';
        return browser.get(url, 10000) as Promise<any>;
    }

    async navigateWithParams(subRoute: string, params: string): Promise<any> {
        const url = `/pe/${subRoute}/${params}`;
        return browser.get(url, 10000) as Promise<any>;
    }

    // ------------------------------ Find General Elements ------------------------------

    getParticularElementById(id: string): ElementFinder {
        return element(by.id(id));
    }

    getParticularElementByCss(css: string): ElementFinder {
        return element(by.css(css));
    }

    getParticularElementWithTextByCss(css: string, text: string): ElementFinder {
        return element(by.cssContainingText(css, text));
    }

    getChildElementById(parentEl: ElementFinder, id: string): ElementFinder {
        return parentEl.element(by.id(id));
    }

    getChildElementByCss(parentEl: ElementFinder, css: string): ElementFinder {
        return parentEl.element(by.css(css));
    }

    getChildElementWithTextByCss(parentEl: ElementFinder, css: string, text: string): ElementFinder {
        return parentEl.element(by.cssContainingText(css, text));
    }

    getChildElementAtIndexWithTextByCss(
        parentEl: ElementFinder,
        css: string,
        text: string,
        index: number
    ): ElementFinder {
        return parentEl.all(by.cssContainingText(css, text)).get(index);
    }

    getAllElementsByCss(parentEl: ElementFinder, css: string): ElementArrayFinder {
        return parentEl.all(by.css(css));
    }

    getElementAtIndex(parentEl: ElementArrayFinder, index: number): ElementFinder {
        return parentEl.get(index);
    }

    getElementAtIndexByCss(parentEl: ElementFinder, css: string, index: number): ElementFinder {
        return parentEl.all(by.css(css)).get(index);
    }

    // ------------------------------ Form-related ------------------------------

    getFieldRequiredIndEl(fieldEl: WebElement): WebElementPromise {
        return fieldEl.getDriver().findElement({ css: `.mat-form-field-required-marker` });
    }

    getFieldOutlineEl(fieldEl: WebElement): WebElementPromise {
        return fieldEl.getDriver().findElement({
            css: `mat-form-field.mf-form-field.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline`
        });
    }

    getFieldErrMsgEl(fieldEl: WebElement): WebElementPromise {
        return fieldEl.getDriver().findElement({ css: `mat-error.mat-error` });
    }

    /**
     * This will return true if all of the following criteria are met:
     *   - the field displays a "required" indicator (asterisk)
     *   - the field's outline color is the error color
     *   - the error message displayed equates to the "required" error message
     */
    async checkRequiredFieldValidation(field: ElementFinder): Promise<boolean> {
        const fieldEl: WebElement = await field.getWebElement();
        const fieldRequiredIndEl: WebElement = await this.getFieldRequiredIndEl(fieldEl);
        const fieldOutlineEl: WebElement = await this.getFieldOutlineEl(fieldEl);
        const fieldErrMsgEl: WebElement = await this.getFieldErrMsgEl(fieldEl);

        const reqIndDisplayed: boolean = await fieldRequiredIndEl.isDisplayed();
        const errOutlineColor: string = await fieldOutlineEl.getCssValue('color');
        const errMsg: string = await fieldErrMsgEl.getText();

        return (
            reqIndDisplayed &&
            errOutlineColor === this.fieldErrorColor &&
            errMsg === this.requiredFieldErrorMsg
        );
    }

    // ------------------------------ Execute Element Actions ------------------------------

    enterValueIntoField(value: any, field: ElementFinder): promise.Promise<void> {
        return field.sendKeys(value);
    }

    // ------------------------------------------------------------
}
