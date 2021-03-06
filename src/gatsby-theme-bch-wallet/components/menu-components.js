/*
  This file is how you add new menu items to your site. It uses the Gatsby
  concept of Component Shadowing:
  https://www.gatsbyjs.org/blog/2019-04-29-component-shadowing/

  It over-rides he default file in the gatsby-ipfs-web-wallet Theme.
*/

import React from 'react'
import { Sidebar } from 'adminlte-2-react'

// Example/Demo component. This is how you would build a component internal to
// your wallet app/site.
// import DemoComponent from '../../demo-component'

// TX History Plugin.
// This is an example of an external plugin for the wallet. It's a modular
// approach to sharing 'lego blocks' between wallet apps.
// import TXHistory from 'gatsby-plugin-bch-tx-history/src/components/txhistory'
// import TXHistory from 'gatsby-plugin-bch-tx-history'

// Default components from gatsby-ipfs-web-wallet.
import Wallet from 'gatsby-theme-bch-wallet/src/components/admin-lte/wallet'
import Tokens from 'gatsby-theme-bch-wallet/src/components/admin-lte/tokens'
import Configure from 'gatsby-theme-bch-wallet/src/components/admin-lte/configure'
import SendReceive from 'gatsby-theme-bch-wallet/src/components/admin-lte/send-receive'
import Orders from '../../orders'
import Taken from '../../taken'

const { Item } = Sidebar

const MenuComponents = props => {
  return [
    {
      active: true,
      key: 'Orders',
      component: <Orders key='Orders' {...props} />,
      menuItem: <Item icon='fas-coins' key='Orders' text='Orders' />
    },
    {
      key: 'Taken',
      component: <Taken key='Taken' {...props} />,
      menuItem: <Item icon='fas-coins' key='Taken' text='Taken' />
    },
    {
      key: 'Tokens',
      component: <Tokens key='Tokens' {...props} />,
      menuItem: <Item icon='fas-coins' key='Tokens' text='Tokens' />
    },
    {
      key: 'Send/Receive BCH',
      component: <SendReceive key='Send/Receive BCH' {...props} />,
      menuItem: (
        <Item
          icon='fa-exchange-alt'
          key='Send/Receive BCH'
          text='Send/Receive BCH'
        />
      )
    },
    {
      key: 'Wallet',
      component: <Wallet key='Wallet' interface='consumer-api' {...props} />,
      menuItem: <Item icon='fa-wallet' key='Wallet' text='Wallet' />
    },
    {
      key: 'Configure',
      component: <Configure key='Configure' {...props} />,
      menuItem: <Item icon='fas-cog' key='Configure' text='Configure' />
    }
  ]
}

export default MenuComponents
