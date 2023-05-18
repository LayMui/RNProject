/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line unicorn/filename-case
import { Log, Task } from '@serenity-js/core'
import { LastResponse, PostRequest, Send } from '@serenity-js/rest'


export const ReadSMS = {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    withCredentials: (hmac: string, recipient: string, environment: string, vendor: string, isCached: boolean) =>
        Task.where(
            `#actor read SMS`,
            Log.the(process.env.AUTHORIZATION),
            Send.a(
                PostRequest.to('/api/v1/readsms')
            .with({
                recipient: recipient,
                environment: environment,
                vendor: vendor,
                isCached: isCached,
            })
            .using({
                headers: {
                    'Authorization': hmac,
                    'Content-Type': 'application/json',
                },
            }),
            ),
            Log.the(LastResponse.body())
        ),    
}
