import React, { createContext } from 'react';

export const ActionContext = createContext<{ action: object }>({
  action: {},
});
