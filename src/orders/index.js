import React from 'react'
import { Row, Col, Content, Box, DataTable, Button, Inputs } from 'adminlte-2-react'
import Details from './details'
import './orders.css'
const { Text } = Inputs

const axios = require('axios').default

const SERVER = 'http://localhost:5002/'
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
      orderData: null,
      showTakeModal: false,
      takeInput: ''
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
      {
        title: 'Token Id',
        data: 'tokenId',
        render: id => (
          <a href={`https://explorer-xp.avax.network/tx/${id}`} target='_blank' rel='noreferrer'>{id}</a>
        )
      },
      { title: 'Status', data: 'orderStatus' },
      {
        title: '',
        data: 'take',
        render: order => (order.data.orderStatus === 'posted'
          ? (
            <div className='take-btn-table-wrapper'>
              <Button
                text='Take'
                type='primary'
                className='btn-lg on-click-event take-btn'
                onClick={_this.handleTake}
              />
            </div>
            )
          : <p />
        )

      }
    ]
  }

  render () {
    const { data, orderData } = _this.state
    return (
      <>
        <Content
          title='Avax Orders'
          subTitle='Avax Orders List'
          browserTitle='Avax Orders List'
        >
          <Row>
            {orderData && (
              <Col xs={12}>
                <Details order={orderData} onClose={_this.handleClose} onTake={_this.handleTake} />
              </Col>
            )}
            <Col xs={12}>
              <Box title='Order List'>
                <DataTable
                  id='OrdersTable'
                  className='order-table'
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
                      console.log(data)
                      if (data.key === 'hashHandler') { _this.handleHashClick(data) }

                      if (data.key === 'takeHandler') { _this.handleTake(data) }
                    }
                  }}
                />
              </Box>
            </Col>
          </Row>
        </Content>
        {
        _this.state.showTakeModal && (
          <Content
            title='Take'
            modal
            show={_this.state.showTakeModal}
            modalCloseButton
            onHide={_this.handleClose}
          >
            <div className='take-form-wrapper'>
              <Text
                id='take-input'
                name='TakeInput'
                placeholder='Take'
                label='Take'
                labelPosition='above'
                onChange={_this.handleModalInputs}
              />
              <Button
                text='Take'
                type='primary'
                className='btn-lg  take-btn-lg'
              />
            </div>
          </Content>
        )
        }
      </>
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
            key: 'hashHandler',
            subString: _this.cutString(order.offerHash),
            order: order.hash,
            data: order
          },
          // App id row data
          tokenId: order.tokenId,
          orderStatus: order.orderStatus,
          take: {
            key: 'takeHandler',
            data: order
          }
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
      orderData: null,
      showTakeModal: false
    })
  }

  handleTake (order) {
    if (!order.data.status === 'posted') return
    _this.setState({
      tankenInput: '',
      showTakeModal: true
    })
  }

  handleModalInputs (event) {
    const value = event.target.value
    _this.setState({
      [event.target.name]: value
    })
  }
}

export default Orders
