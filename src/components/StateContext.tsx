import React from 'react';

const StateContext = React.createContext<{ token?: string; }>({ token: undefined });

export default StateContext;