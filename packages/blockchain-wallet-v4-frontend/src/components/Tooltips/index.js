import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Tooltip, Link, TextGroup } from 'blockchain-info-components'

class Tooltips extends React.PureComponent {
  render () {
    return (
      <div>
        <Tooltip id='addr' multiline offset={{ bottom: 8 }} />
        <Tooltip id='confirmations' offset={{ bottom: 8 }}>
          <FormattedMessage
            id='scenes.transactions.content.list.listitem.transactionunconfirmed'
            defaultMessage='Your transaction will be complete after it has {minConfirmations} confirmations.'
            values={{ minConfirmations: 3 }}
          />
          <Link
            href='https://support.blockchain.com/hc/en-us/articles/217116406-Why-hasn-t-my-transaction-confirmed-yet-'
            target='_blank'
            size='11px'
            weight={300}
            altFont
          >
            Learn more.
          </Link>
        </Tooltip>
        <Tooltip id='isx.expiredtooltip'>
          <FormattedMessage
            id='scenes.buysell.coinify.isx.expiredtooltip'
            defaultMessage='This is an estimated quote. The original quote for this trade expired. The exact amount of bitcoin received depends on when the payment is received.'
          />
        </Tooltip>
        <Tooltip id='recurring.tooltip'>
          <FormattedMessage
            id='orderdetails.recurring.tooltip'
            defaultMessage='Recurring orders will be placed automatically on a regular basis from your linked credit card.'
          />
        </Tooltip>
        <Tooltip id='exchangedetails.exchangetooltip'>
          <FormattedMessage
            id='modals.exchangedetails.exchangetooltip'
            defaultMessage='This rate may change depending on the market price at the time of your transaction.'
          />
        </Tooltip>
        <Tooltip id='exchangedetails.feetooltip'>
          <FormattedMessage
            id='modals.exchangedetails.feetooltip'
            defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.'
          />
        </Tooltip>
        <Tooltip id='qrcode.tooltip'>
          <FormattedMessage
            id='modals.qrcode.tooltip'
            defaultMessage='Ask the sender to scan this QR code with their bitcoin wallet.'
          />
        </Tooltip>
        <Tooltip id='reqBchShare'>
          <FormattedMessage
            id='modals.requestbch.share_tooltip'
            defaultMessage='Share this address with others, and they can send you Bitcoin Cash directly to your wallet. Your address changes with every payment.'
          />
        </Tooltip>
        <Tooltip id='reqBchQR'>
          <FormattedMessage
            id='modals.requestbch.scan_tooltip'
            defaultMessage='Ask the sender to scan this QR code with their Bitcoin cash wallet'
          />
        </Tooltip>
        <Tooltip id='reqBitcoinShare'>
          <FormattedMessage
            id='modals.requestbitcoin.firststep.sharetooltip'
            defaultMessage='Share this address with others, and they can send you BTC directly to your wallet. Your address changes with every payment. You can also create a request by attaching an amount below.'
          />
        </Tooltip>
        <Tooltip id='reqEthShare'>
          <FormattedMessage
            id='modals.requestether.sharetooltip'
            defaultMessage='Share this address with others, and they can send you ETH directly to your wallet. Your request address will not change.'
          />
        </Tooltip>
        <Tooltip id='reqEthScan'>
          <FormattedMessage
            id='modals.requestether.scan_tooltip'
            defaultMessage='Ask the sender to scan this QR code with their ether wallet'
          />
        </Tooltip>
        <Tooltip id='sendBch.firststep.share_tooltip'>
          <FormattedMessage
            id='modals.sendBch.firststep.share_tooltip'
            defaultMessage='Add a note to remind yourself what this transaction relates to. This note will be private and only seen by you.'
          />
        </Tooltip>
        <Tooltip id='sendether.firststep.sharetooltip'>
          <FormattedMessage
            id='modals.sendether.firststep.sharetooltip'
            defaultMessage='Add a note to remind yourself what this transaction relates to. This note will be private and only seen by you.'
          />
        </Tooltip>
        <Tooltip id='tradingfee.tooltip'>
          <FormattedMessage
            id='orderdetails.tradingfee.tooltip'
            defaultMessage='The fee charged to execute a trade through SFOX.'
          />
        </Tooltip>
        <Tooltip id='exchangecheckout.rate'>
          <FormattedMessage
            id='scenes.buysell.exchangecheckout.rate'
            defaultMessage="The rate offered by your region's exchange partner. May include fees."
          />
        </Tooltip>
        <Tooltip id='tradingfee.tooltip'>
          <FormattedMessage
            id='orderdetails.tradingfee.tooltip'
            defaultMessage='The fee charged to execute a trade through SFOX.'
          />
        </Tooltip>
        <Tooltip id='firststep.tooltip'>
          <TextGroup inline>
            <FormattedMessage
              id='scenes.exchange.shapeshift.firststep.tooltip'
              defaultMessage='This quote may change depending on the market price at the time of your transaction.'
            />
            <Link
              size='12px'
              weight={300}
              href='https://info.shapeshift.io/about'
              target='_blank'
            >
              <FormattedMessage
                id='scenes.exchange.shapeshift.firststep.tooltip2'
                defaultMessage='Learn more'
              />
            </Link>
          </TextGroup>
        </Tooltip>
        <Tooltip id='secondstep.txfeeexplanation'>
          <FormattedMessage
            id='scenes.exchange.shapeshift.secondstep.txfeeexplanation'
            defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.'
          />
        </Tooltip>
        <Tooltip id='secondstep.ratetooltip'>
          <FormattedMessage
            id='scenes.exchange.shapeshift.secondstep.ratetooltip'
            defaultMessage='This rate may change depending on the market price at the time of your transaction.'
          />
        </Tooltip>
        <Tooltip id='secondstep.networkfeetooltip'>
          <FormattedMessage
            id='scenes.exchange.shapeshift.secondstep.networkfeetooltip'
            defaultMessage='ShapeShift will use this fee to send the incoming exchange funds to your wallet.'
          />
        </Tooltip>
        <Tooltip id='shapeshift.exchangetooltip'>
          <FormattedMessage
            id='modals.exchange.shapeshift.exchangetooltip'
            defaultMessage='This rate may change depending on the market price at the time of your transaction.'
          />
        </Tooltip>
        <Tooltip id='shapeshift.feetooltip'>
          <FormattedMessage
            id='modals.exchange.shapeshift.feetooltip'
            defaultMessage='This fee is used to send the incoming exchange funds from ShapeShift.'
          />
        </Tooltip>
        <Tooltip id='activityFeedWatchOnly'>
          <FormattedMessage
            id='scenes.home.activitylist.watchonly'
            defaultMessage='This transaction involves a watch only address.'
          />
        </Tooltip>
        <Tooltip id='settingsBtcUsedBalace'>
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.tooltip'
            defaultMessage='When you send bitcoin, your Blockchain wallet automatically selects addresses to spend from. That is why the current balance of an address can be different from the total received value.'
          />
        </Tooltip>
      </div>
    )
  }
}

export default Tooltips
