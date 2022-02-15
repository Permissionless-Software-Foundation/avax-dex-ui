import React from 'react'
import { Row, Col, Content, Box, DataTable } from 'adminlte-2-react'
import Details from './details'
import './orders.css'
const axios = require('axios').default

const SERVER = 'http://localhost:5700/'
// const EXPLORER_URL = 'https://explorer.bitcoin.com/bch/tx/'

let _this
class Orders extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      showEntry: false,
      data: [],
      orders: [],
      orderData: null
    }

    this.firstColumns = [
      { title: 'Created At', data: 'createdAt' },
      {
        title: 'Type',
        data: 'buyOrSell'
      },
      {
        title: 'Offer hash',
        data: 'offerHash',
        render: hash => (
          <span className='on-click-event action-handler'>
            {hash.subString}
          </span>
        )
      },
      { title: 'Token Id', data: 'tokenId' },
      { title: 'Status', data: 'orderStatus' }
    ]
  }

  render () {
    const { data, orderData } = _this.state
    return (
      <Content
        title='Avax Orders'
        subTitle='Avax Orders List'
        browserTitle='Avax Orders List'
      >
        <Row>
          {orderData && (
            <Col xs={12}>
              <Details order={orderData} onClose={_this.handleClose} />
            </Col>
          )}
          <Col xs={12}>
            <Box title='Order List'>
              <DataTable
                columns={_this.firstColumns}
                data={data}
                options={{
                  paging: true,
                  lengthChange: false,
                  searching: false,
                  ordering: false,
                  info: true,
                  autoWidth: false
                }}
                onClickEvents={{
                  onClickEvent: (data, rowIdx, rowData) => {
                    _this.handleHashClick(data)
                  }
                }}
              />
            </Box>
          </Col>
        </Row>
      </Content>
    )
  }

  async componentDidMount () {
    _this.handleOrders()

    // Get data and update the table
    // every 20 seconds
    setInterval(() => {
      _this.handleOrders()
    }, 30000)
  }

  async handleOrders () {
    const orders = await _this.getOrders()
    _this.generateDataTable(orders)
  }

  // REST petition to Get data fron the pw2db
  async getOrders () {
    try {
      const options = {
        method: 'GET',
        url: `${SERVER}order/list/`,
        data: {}
      }
      const result = await axios.request(options)
      console.log('result.data', result.data)
      _this.setState({
        orders: result.data
      })
      return result.data
    } catch (err) {
      console.warn('Error in getOrders() ', err)
    }
  }

  // Generate table content
  generateDataTable (dataArr) {
    try {
      const data = []

      for (let i = 0; i < dataArr.length; i++) {
        const order = dataArr[i]
        const row = {
          // createdAt row data
          createdAt: new Date(order.timestamp).toLocaleString(),
          // Transaction id row data
          buyOrSell: order.buyOrSell,
          // Hash row data
          offerHash: {
            subString: _this.cutString(order.offerHash),
            order: order.hash,
            data: order
          },
          // App id row data
          tokenId: order.tokenId,
          orderStatus: order.orderStatus
        }
        data.push(row)
      }
      _this.setState({
        data
      })
    } catch (err) {
      console.warn('Error in generateDataTable() ', err)
    }
  }

  cutString (txid) {
    try {
      const subTxid = txid.slice(0, 4)
      const subTxid2 = txid.slice(-4)
      return `${subTxid}...${subTxid2}`
    } catch (err) {
      console.warn('Error in cutString() ', err)
    }
  }

  handleHashClick (data) {
    try {
    //  data.isValid = data.isValid.toString()
      _this.setState({
        orderData: data
      })
    } catch (err) {
      _this.setState({
        orderData: null
      })
      console.warn('Error in handleHashClick() ', err)
    }
  }

  handleClose () {
    _this.setState({
      orderData: null
    })
  }
}

export default Orders
