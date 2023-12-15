import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

import { LocalStorageFragment } from './provider/LocalStorageContext.tsx'
import { ItemsFragment } from './provider/ItemsContext.tsx'
import { CheckItemsFragment } from './provider/CheckItemsContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocalStorageFragment>
      <ItemsFragment>
        <CheckItemsFragment>
          <App />
        </CheckItemsFragment>
      </ItemsFragment>
    </LocalStorageFragment>
  </React.StrictMode>,
)
