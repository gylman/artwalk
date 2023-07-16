import React from 'react';
import './flow/config';
import { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

const WalletModal = () => {
  const [user, setUser] = useState({ loggedIn: null });

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? 'No Address'}</div>
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    );
  };

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    );
  };

  return (
    <div>{user.loggedIn ? <AuthedState /> : <UnauthenticatedState />}</div>
  );
};

export default WalletModal;
