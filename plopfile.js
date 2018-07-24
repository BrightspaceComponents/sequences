const locales = require('./locales.json');

module.exports = function(plop) {
    plop.setPartial('locales', JSON.stringify(locales));

    plop.setGenerator('localize', {
        description: 'localize behavior',
        prompts: [],
        actions: [{
            type: 'add',
            path: './localize-behavior.html',
            templateFile: './plop/localize-behavior.hbs',
            force: true
        }]
    })
}