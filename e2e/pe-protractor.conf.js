// We need our environment config file to avoid hardcoding config options for credentials
const env = require('./dist/environment.js');

// We can't set "baseUrl" to a value in params, so we'll fetch it here first
const cliArgs = process.argv.filter(arg => {
    return arg.includes('--targetEnv');
});
// We want to default our test environment to SIT
const testEnv = cliArgs.length > 0 ? cliArgs[0].split('=')[1] : 'sit';

exports.config = {
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    SELENIUM_PROMISE_MANAGER: false,
    allScriptsTimeout: 20000, // default timeout for script execution
    getPageTimeout: 60000, // default timeout for page load
    specs: ['./src/features/*.feature'],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            useAutomationExtension: false,
            args: [
                '--disable-extensions',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-infobars',
                '--window-size=1800x1600'
            ]
        }
    },
    plugins: [{
        package: 'protractor-multiple-cucumber-html-reporter-plugin',
        options: {
            automaticallyGenerateReport: true,
            removeExistingJsonReportFile: true,
            reportName: 'Pricing Engine',
            pageTitle: 'Pricing Engine - Results',
            reportPath: 'libs/pricing-engine/e2e/reporting/html-reports',
            openReportInBrowser: true
        }
    }],
    directConnect: true,
    baseUrl: env[testEnv],
    params: {
        login: {
            analyst: env.testCredentials.analystUser,
            developer: env.testCredentials.devUser
        },
        quoteDetails: {
            quoteId: '200015',
            comparePriceTab: {
                comparableQuotes: []
            },
            opportunityTab: {
                selectedQuotes: []
            },
            approvalTab: {
                testApprover: 'Neupane, Bishnu'
            }
        }
    },
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    ignoreUncaughtExceptions: true,
    onPrepare() {
        browser.ignoreSynchronization = true;
        browser
            .manage()
            .window()
            .maximize();
    },
    cucumberOpts: {
        compiler: 'ts:ts-node/register',
        format: ['json:libs/pricing-engine/e2e/reporting/json-reports/results.json'],
        require: ['./dist/src/steps/*.steps.js', './dist/src/support/*.js'],
        strict: true,
        tags: '@MFPRICING-100'
    }
};
