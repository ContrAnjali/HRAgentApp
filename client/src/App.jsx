
// client/src/App.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ReactWebChat, { createStore } from 'botframework-webchat';
import { DirectLine } from 'botframework-directlinejs';

import PromptCards from './components/prompts.jsx';
import { ensureSignedIn,getUserAvatarImage } from './msal.js';
import { createSSOStore } from './ssoStore.js';

import './components/promptOverlay.css';

export default function App() {
  const [token, setToken] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  // Overlay & startup flags
  const [showOverlay, setShowOverlay] = useState(true);
  const [startConversation, setStartConversation] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);



  // 1) Site-level sign-in (MSAL)
  useEffect(() => {
    (async () => {
      const account = await ensureSignedIn();
      setUserID(account.homeAccountId.slice(0, 64)); // Web Chat requires <= 64 chars
      setUserName(account.name);
      const avatar = await getUserAvatarImage();
      setUserAvatar(avatar);
    })();
  }, []);

  // 2) Get PVA Direct Line token from your server
  useEffect(() => {
    (async () => {
      const url = import.meta.env.VITE_TOKEN_URL || 'http://localhost:3987/api/directline/token';
      console.log('Fetching DL token from:', url);

      const res = await fetch(url, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const body = await res.text();
        console.error(`HTTP ${res.status} ${res.statusText}\n${body.slice(0, 200)}`);
        return;
      }

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const body = await res.text();
        throw new Error('Expected JSON, got ' + ct + '. Body: ' + body.slice(0, 200));
      }

      const { token } = await res.json(); // server returns { token, conversationId }
      setToken(token);
    })();
  }, []);

  // 3) Direct Line
  const directLine = useMemo(() => (token ? new DirectLine({ token }) : null), [token]);

  // 4) SSO-aware store (with overlay-hiding interception)
  //    We wrap dispatch to catch typing and send actions and hide overlay.
  const store = useMemo(() => {
    const baseStore =
      directLine && userID ? createSSOStore(directLine, userID) : createStore();

    const originalDispatch = baseStore.dispatch;

    baseStore.dispatch = (action) => {
      // Hide on first keystroke in the send box
      // if (
      //   action?.type === 'WEB_CHAT/SET_SEND_BOX' &&
      //   action?.payload?.text &&
      //   action.payload.text.length > 0
      // ) {
      //   setShowOverlay(false);
      // }

      // Hide when user submits the send box (presses Enter / clicks Send)
      if (action?.type === 'WEB_CHAT/SUBMIT_SEND_BOX') {
        setShowOverlay(false);
      }

      return originalDispatch(action);
    };

    return baseStore;
  }, [directLine, userID]); // setShowOverlay is stable, safe to use here

  // 5) Optional: start the conversation ONCE by firing an event
  useEffect(() => {
    if (!directLine || !userID || !startConversation || hasJoined) return;

    const sub = directLine
      .postActivity({
        type: 'event',
        name: 'startConversation', // change to 'webchat/join' if your bot expects that
        from: { id: userID, name: userName }
      })
      .subscribe({
        error: (err) => console.error('startConversation event error:', err)
      });

    setHasJoined(true);
    setStartConversation(false);

    return () => sub?.unsubscribe?.();
  }, [directLine, userID, userName, startConversation, hasJoined]);

  // 6) ALSO hide overlay when the first user message is observed on the stream (redundant safety)
  useEffect(() => {
    if (!directLine || !userID) return;

    const sub = directLine.activity$.subscribe((activity) => {
      if (activity.type === 'message' && activity.from?.id === userID) {
        setShowOverlay(false);
      }
    });

    return () => sub?.unsubscribe?.();
  }, [directLine, userID]);

  // Prompts for overlay
  const prompts = [    
    { id: 'bonus', title: 'Am I eligible for the referral bonus?', description: 'Get policy details (travel, WFH, etc.).', text: 'Share the latest travel policy summary.' ,imageSrc:<img src='assets/prompt-icon.svg' alt='Portal Icon' className='sm-device-hide' /> },
    { id: 'leave', title: 'What types of leave can I take?', description: 'Start an expense flow for a recent trip.', text: 'I want to raise a new travel expense.',imageSrc:<img src='assets/prompt-icon.svg' alt='Portal Icon' className='sm-device-hide' />  },
    { id: 'refer', title: 'How do I refer someone?', description: 'Ask HR bot to show your remaining leaves.', text: 'What is my current leave balance?',imageSrc:<img src='assets/prompt-icon.svg' alt='Portal Icon' className='sm-device-hide' /> },
    { id: 'report', title: 'How do I report harassment?', description: 'Get policy details (travel, WFH, etc.).', text: 'Share the latest travel policy summary.' ,imageSrc:<img src='assets/prompt-icon.svg' alt='Portal Icon' className='sm-device-hide' /> },
    { id: 'ticket', title: 'How to check ticket status?', description: 'Start an expense flow for a recent trip.', text: 'I want to raise a new travel expense.',imageSrc:<img src='assets/prompt-icon.svg' alt='Portal Icon' className='sm-device-hide' />  },
    { id: 'travel', title: 'Show me the travel reimbursement policy.', description: 'Ask HR bot to show your remaining leaves.', text: 'What is my current leave balance?',imageSrc:<img src='assets/prompt-icon.svg' alt='Portal Icon' className='sm-device-hide' /> },
    { id: 'leave', title: 'How do I check my leave balance?', description: 'Get policy details (travel, WFH, etc.).', text: 'Share the latest travel policy summary.' ,imageSrc:<img src='assets/prompt-icon.svg' alt='Portal Icon' className='sm-device-hide' /> },
    { id: 'ticket', title: 'How to raise a ticket?', description: 'How to raise a ticket?', text: 'What is my current leave balance?',imageSrc:<img src='assets/prompt-icon.svg' alt='Portal Icon' className='sm-device-hide' /> }
  ];

  // On prompt click: prefill SAME Web Chat input box and hide overlay
  const handleSelectPrompt = (prompt) => {
    store.dispatch({
      type: 'WEB_CHAT/SET_SEND_BOX',
      payload: { text: prompt.title }
    });

    // Best-effort focus
    store.dispatch({ type: 'WEB_CHAT/FOCUS_SEND_BOX' });
    setTimeout(() => {
      const input = document.querySelector('.webchat__send-box input, [role="form"] input');
      input?.focus();
    }, 0);

    // setShowOverlay(false);
  };

  if (!token || !directLine) {
    return <div style={{ padding: 16 }}>Loading…</div>;
  }

  return (
    <div style={{ height: '100vh' }}>
      <Header userID={userID} userName={userName} userAvatar={userAvatar}/>

      {directLine && userID ? (
        <div className="chat-container" style={{ position: 'relative' }}>
          <div className="chat-window chat-window-container">
            <ReactWebChat
              directLine={directLine}
              userID={userID}
              locale="en-IN"
              store={store}
              styleOptions={{
                botAvatarImage:
                  'https://docs.microsoft.com/en-us/azure/bot-service/v4sdk/media/logo_bot.svg?view=azure-bot-service-4.0',
                botAvatarInitials: 'BF',
                userAvatarImage: userAvatar,
                userAvatarInitials: 'WC',                
                backgroundColor: '#ffffff',
                sendBoxTextWrap: true
              }}
            />
          </div>

          {/* Overlay that hides transcript, keeps send box accessible */}
          {showOverlay && (
            <div className="prompt-overlay" aria-label="Prompt selection">
              <section className="hero-section">
                <div>
                  <img src="assets/Boticon.png" alt="Robot Icon" height={40} width={40} />
                </div>
                <h2>Welcome</h2>
                <p>
                  How can I assist you today?
                </p></section>
              {/* <div className="overlay-header">                
                <button
                  className="overlay-close"
                  onClick={() => setShowOverlay(false)}
                  aria-label="Close prompt overlay"
                >
                  ✕
                </button>
              </div> */}

              <PromptCards prompts={prompts} onSelect={handleSelectPrompt} />
            </div>
          )}
        </div>
      ) : (
        <p>Loading chat…</p>
      )}

      <Footer />
    </div>
  );
}
