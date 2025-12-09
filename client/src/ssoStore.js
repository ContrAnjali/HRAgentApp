
// client/src/ssoStore.js
import { createStore } from 'botframework-webchat';
import { acquireResourceToken } from './msal.js';

export function createSSOStore(directLine, userID) {
  return createStore({}, () => next => action => {
    if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const activity = action.payload?.activity;
      const oauthAttachment = activity?.attachments?.find(
        a => a?.contentType === 'application/vnd.microsoft.card.oauth'
      );
      const content = oauthAttachment?.content;

      const hasTokenExchange = !!content?.tokenExchangeResource;
      const connectionName = content?.connectionName;

      if (hasTokenExchange && connectionName) {
        acquireResourceToken()
          .then(accessToken => {
            directLine
              .postActivity({
                type: 'invoke',
                name: 'signin/tokenExchange',
                value: {
                  id: activity.id,
                  connectionName,
                  token: accessToken
                },
                from: { id: userID }
              })
              .subscribe({
                error: err => console.error('Token exchange failed:', err)
              });
          })
          .catch(err => {
            console.error('Failed to acquire user token:', err);
          });
      }
    }

    return next(action);
    });
}
