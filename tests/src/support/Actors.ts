import { Actor, Cast, TakeNotes } from '@serenity-js/core';
import { CallAnApi } from '@serenity-js/rest';
import axios from 'axios';
import { ensure, isNotBlank } from 'tiny-types';

const axiosInstance = axios.create({
    baseURL: 'https://dev-farmer-india.eu.auth0.com',
    timeout: 5000,
    headers: { Accept: 'application/json' },
});
export class Actors implements Cast {
    constructor(private readonly baseApiUrl: string) {
        ensure('apiUrl', baseApiUrl, isNotBlank());
    }

    prepare(actor: Actor): Actor {        
        return actor.whoCan(
            CallAnApi.using(axiosInstance),
            TakeNotes.usingAnEmptyNotepad(),
        );
    }
}

