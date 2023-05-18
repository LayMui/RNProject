module.exports = {
    default: `
        --publish-quiet
        --require=src/**/*.ts
        --require-module=ts-node/register
        --format=@serenity-js/cucumber
        --world-parameters={"baseApiUrl":"https://dev-farmer-india.eu.auth0.com"}
    `,
}
