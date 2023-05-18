import { defineParameterType, setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(10000000);

defineParameterType({
    regexp: /[A-Z][a-z]+/,
    transformer(name: string) {
        
    },
    name: 'actor',
});

defineParameterType({
    regexp: /he|she|they|his|her|their/,
    transformer() {
    },
    name: 'pronoun',
});
