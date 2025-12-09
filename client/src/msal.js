
// client/src/msal.js
// import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

// // TODO: replace with your Entra ID app values
// const msalConfig = {
//   auth: {
//     clientId: 'bf8d0a30-b4f8-46a2-ba2a-701f7c601d42',
//     authority: 'https://login.microsoftonline.com/c2db7cf7-e92b-449c-9f63-1aec8690e3f2',
//     redirectUri: window.location.origin
//   },
//   cache: {
//     cacheLocation: 'sessionStorage',
//     storeAuthStateInCookie: false
//   }
// };

// // IMPORTANT: scope must match the audience/resource configured in your bot’s OAuth connection.
// // Example: 'api://YOUR_RESOURCE_APP_ID/.default' or 'https://graph.microsoft.com/.default'
// export const TOKEN_RESOURCE_SCOPE = 'api://bf8d0a30-b4f8-46a2-ba2a-701f7c601d42';

// export const msalApp = new PublicClientApplication(msalConfig);

// export async function ensureSignedIn() {
//   let account = msalApp.getActiveAccount() || msalApp.getAllAccounts()[0];
//   if (!account) {
//     const loginResp = await msalApp.loginPopup({ scopes: [TOKEN_RESOURCE_SCOPE] });
//     account = loginResp.account;
//     msalApp.setActiveAccount(account);
//   }
//   return account;
// }

// export async function acquireResourceToken() {
//   const account = msalApp.getActiveAccount() || msalApp.getAllAccounts()[0];
//   if (!account) {
//     await ensureSignedIn();
//   }
//   try {
//     const tokenResp = await msalApp.acquireTokenSilent({
//       account: msalApp.getActiveAccount(),
//       scopes: [TOKEN_RESOURCE_SCOPE]
//     });
//     return tokenResp.accessToken;
//   } catch (err) {
//     if (err instanceof InteractionRequiredAuthError) {
//       const tokenResp = await msalApp.acquireTokenPopup({ scopes: [TOKEN_RESOURCE_SCOPE] });
//       return tokenResp.accessToken;
//     }
//     throw err;
//   }
// }

import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'bf8d0a30-b4f8-46a2-ba2a-701f7c601d42',
    authority: 'https://login.microsoftonline.com/c2db7cf7-e92b-449c-9f63-1aec8690e3f2',
    redirectUri: window.location.origin
  },
  cache: { cacheLocation: 'sessionStorage', storeAuthStateInCookie: false }
};

const msalApp = new PublicClientApplication(msalConfig);

// Ensure MSAL v3 is initialized before using any API
let msalInitialized = false;
export async function ensureMsalInitialized() {
  if (!msalInitialized) {
    await msalApp.initialize(); // ⬅️ required in v3
    msalInitialized = true;
  }
}

export async function ensureSignedIn() {
  await ensureMsalInitialized();

  let account = msalApp.getActiveAccount() || msalApp.getAllAccounts()[0];
  if (!account) {
    const loginResp = await msalApp.loginPopup({ scopes: [TOKEN_RESOURCE_SCOPE] });
    account = loginResp.account;
    msalApp.setActiveAccount(account);
  }
  return account;
}

export async function acquireResourceToken() {
  await ensureMsalInitialized();

  const account = msalApp.getActiveAccount() || msalApp.getAllAccounts()[0];
  if (!account) await ensureSignedIn();

  try {
    const tokenResp = await msalApp.acquireTokenSilent({
      account: msalApp.getActiveAccount(),
      scopes: [TOKEN_RESOURCE_SCOPE]
    });
    return tokenResp.accessToken;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      const tokenResp = await msalApp.acquireTokenPopup({ scopes: [TOKEN_RESOURCE_SCOPE] });
      return tokenResp.accessToken;
    }
    throw err;
  }
}

// Make sure your scope/audience matches the bot's OAuth Connection resource:
export const TOKEN_RESOURCE_SCOPE = 'api://bf8d0a30-b4f8-46a2-ba2a-701f7c601d42/AppReg2CopilotChat';
