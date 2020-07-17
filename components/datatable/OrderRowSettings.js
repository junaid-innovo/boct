export default OrderRowSettings = {
   mode: 'checkbox',
   clickToSelect: true,
   onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
         let order_id = row.order_id
         // let selectedOrderIds = [...this.state.selectedOrders, order_id]
         let selectedOrderIds = this.state.selectedOrders
         if (!selectedOrderIds.includes(order_id)) {
            selectedOrderIds.push(order_id)
         }
         this.setState({
            selectedOrderId: selectedOrderIds,
         })
         this.props.sendSelectedOrderId(selectedOrderIds)
      } else {
         let order_id = row.order_id
         // let selectedOrderIds = [...this.state.selectedOrders, order_id]
         let selectedOrderIds = this.state.selectedOrders
         if (selectedOrderIds.includes(order_id)) {
            _.remove(selectedOrderIds, (item) => item == order_id)
         }
         this.setState({
            selectedOrderId: selectedOrderIds,
         })
         this.props.sendSelectedOrderId(selectedOrderIds)
      }
   },
   onSelectAll: (isSelect, rows, e) => {
      if (isSelect) {
         let selectedOrders = this.state.selectedOrders
         let selectedorderids = _.map(products, 'order_id')
         let finalOrders = [...this.state.selectedOrders, ...selectedorderids]
         this.setState({
            selectedOrders: _.uniq(finalOrders),
         })
         this.props.sendSelectedOrderId(finalOrders)
      } else {
         let selectedOrders = this.state.selectedOrders
         let roworder_ids = _.map(products, 'order_id')
         let finalOrders = _.pullAll(selectedOrders, roworder_ids)
         this.setState({
            selectedOrders: _.uniq(finalOrders),
         })
         this.props.sendSelectedOrderId(finalOrders)
      }
   },

   selected: this.state.selectedOrders,
}
