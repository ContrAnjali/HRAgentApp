
// ssoStore.js
import { createStore } from 'botframework-webchat';
import { acquireResourceToken } from './msal.js';

export function createSSOStore(directLine, userID) {
  return createStore({}, () => next => action => {
    // Only act before render
    if (action.type !== 'DIRECT_LINE/QUEUE_INCOMING_ACTIVITY') {
      return next(action);
    }

    const activity = action.payload?.activity;

    // Ignore non-message activities (events, typing, etc.)
    if (!activity || activity.type !== 'message') {
      return next(action);
    }
    
 if (activity.type === 'message' && /sign\s*in|login/i.test(activity.text || '')) {
  return; // skip this bubble
}

    // Find OAuth card
    const oauthAttachment = (activity.attachments || []).find(
      a => a?.contentType === 'application/vnd.microsoft.card.oauth'
    );
    if (!oauthAttachment) {
      return next(action); // no OAuth card in this message
    }

    const { tokenExchangeResource, connectionName } = oauthAttachment.content || {};

    // If the card has token-exchange info, try SSO
    if (tokenExchangeResource?.id && tokenExchangeResource?.uri && connectionName) {
      acquireResourceToken(tokenExchangeResource.uri) // scopes `${uri}/.default` inside msal.js
        .then(token =>
          directLine
            .postActivity({
              type: 'invoke',
              name: 'signin/tokenExchange',
              value: {
                id: tokenExchangeResource.id, // MUST match tokenExchangeResource.id
                connectionName,
                token
              },
              from: { id: userID}
            })
            .subscribe()
        )
        .catch(err => console.error('[SSO] token exchange failed:', err));
    }

    // Hide the OAuth card UI but keep any other text/attachments in the same activity
    const filtered = (activity.attachments || []).filter(
      a => a?.contentType !== 'application/vnd.microsoft.card.oauth'
    );
    const modified = {
      ...action,
      payload: { ...action.payload, activity: { ...activity, attachments: filtered } }
    };

    return next(modified);
  });
}
