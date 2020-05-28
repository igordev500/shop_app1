const CLIENT_ID = "5eb83a01e3979600125b73dd";
const PUBLIC_KEY = "3ac18ff34e08a5728dbe0f8946e710";
const SANDBOX_PASSWORD = "44d496fe4888f5fb98a91fb7ed43d1";
const DEVELOPMENT_PASSWORD = "403d7bedb27b2e7ccc21d41b48c76e";

import React from 'react';
import { Text } from 'react-native';
import PlaidAuthenticator from 'react-native-plaid-link';
 
export default function PlaidComponent({onMessage, name}){
  return (
    <PlaidAuthenticator
      publicKey={PUBLIC_KEY}
      clientName={name}
      env='sandbox'  // 'sandbox' or 'development' or 'production'
      product={'auth, transactions'}
      onMessage={onMessage}
      selectAccount={false}
    />
  );
};