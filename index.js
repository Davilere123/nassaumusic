import React from 'react';
import { registerRootComponent } from 'expo';

import App from './App';
import { DatabaseProvider } from './context/DatabaseContext';

function Root() {
  return (
    <DatabaseProvider>
      <App />
    </DatabaseProvider>
  );
}

registerRootComponent(Root);
