// client/src/App.jsx
import React, { useEffect, useMemo, useState } from 'react';
import ReactWebChat, { createStore } from 'botframework-webchat';
import { DirectLine } from 'botframework-directlinejs';

import { ensureSignedIn, acquireResourceToken } from './msal.js';   // your MSAL helpers
import { createSSOStore } from './ssoStore.js';                     // your OAuth-card intercept middleware

export default function App() {
  const [token, setToken] = useState(null);
  const [userID, setUserID] = useState(null);

  // Site-level sign-in (MSAL)
  useEffect(() => {
    (async () => {
      const account = await ensureSignedIn();
      setUserID(account.homeAccountId.slice(0, 64)); // Web Chat requires <=64 chars
    })();
  }, []);

  // Get PVA Direct Line token from your server


  
useEffect(() => {
  (async () => {
    const url = import.meta.env.VITE_TOKEN_URL || 'http://localhost:3987/api/directline/token';
    console.log('Fetching DL token from:', url);

    const res = await fetch(url, { headers: { Accept: 'application/json' } });

    // 1) Check HTTP status
    if (!res.ok) {
      const body = await res.text();
      console.error(`HTTP ${res.status} ${res.statusText}\n${body.slice(0, 200)}`);
      return; // stop here, DL token not available
    }

    // 2) Check Content-Type
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      const body = await res.text(); // HTML shell if wrong endpoint/proxy
      throw new Error('Expected JSON, got ' + ct + '. Body: ' + body.slice(0, 200));
    }

    // 3) Parse DL token and set
    const { token } = await res.json(); // server returns { token, conversationId }
    setToken(token);
  })();
}, []);

  


  const directLine = useMemo(() => (token ? new DirectLine({ token }) : null), [token]);

  // SSO-aware store that intercepts OAuthCard and posts signin/tokenExchange
  const store = useMemo(() => {
    if (directLine && userID) return createSSOStore(directLine, userID);
    return createStore();
  }, [directLine, userID]);

  // Optional: auto-start the conversation for PVA
  useEffect(() => {
    if (directLine && userID) {
      directLine
        .postActivity({ type: 'event', name: 'startConversation', from: { id: userID } })
        .subscribe();
    }
  }, [directLine, userID]);

  return (
    <div style={{ height: '100vh' }}>
      {directLine && userID ? (
        <ReactWebChat
          directLine={directLine}
          store={store}
          userID={userID}
          locale="en-IN"
          styleOptions={{
            bubbleBackground: '#F5F5F5',
            bubbleFromUserBackground: '#DCF8C6'
          }}
        />
      ) : (
        <p>Loading chat…</p>
      )}
    </div>
  );
}
