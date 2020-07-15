import { LANGUAGE_STRING } from '../Enviroment/Enviroment'

export const OrderTableColumns = [
   // {
   //    dataField: 'order_id',
   //    text: 'Order Id',
   //    sort: true,
   //    headerStyle: {
   //       fontSize: '12px',
   //    },
   //    style: {
   //       fontSize: '12px',
   //    },
   // },
   {
      dataField: 'order_number',
      text: 'Order No',
      // formatExtraData: dataField,
      sort: true,
      style: {
         fontSize: '12px',
      },
      headerStyle: {
         fontSize: '12px',
         outline: 'none',
      },
   },
   // {
   //    dataField: 'order_ammount',
   //    text: 'Ammount',
   //    sort: true,
   //    style: {
   //       fontSize: '12px',
   //    },
   //    headerStyle: {
   //       fontSize: '12px',
   //    },
   // },
   // {
   //    dataField: 'payment_type',
   //    text: 'Payment Type',
   //    sort: true,
   //    style: {
   //       fontSize: '12px',
   //    },
   //    headerStyle: {
   //       fontSize: '12px',
   //    },
   // },
   // {
   //    dataField: 'Delivery Slot',
   //    text: 'Delivery Slot',
   //    sort: true,
   //    style: {
   //       fontSize: '12px',
   //    },
   //    headerStyle: {
   //       fontSize: '12px',
   //    },
   // },
   {
      dataField: 'created_at',
      text: 'Order Date',
      sort: true,
      style: {
         fontSize: '12px',
      },
      headerStyle: {
         fontSize: '12px',
         outline: 'none',
      },
   },
   {
      dataField: 'address.area_name',
      text: 'Location',
      sort: true,
      style: {
         fontSize: '12px',
      },
      headerStyle: {
         fontSize: '12px',
         outline: 'none',
      },
   },
   {
      dataField: 'payment_type',
      text: '',

      // sort: true,
      style: {
         fontSize: '12px',
      },
      headerStyle: {
         fontSize: '12px',
         outline: 'none',
      },
   },
   {
      dataField: 'erp_id',
      text: 'Action',
      hidden: true,
      // sort: true,
      style: {
         fontSize: '12px',
      },
      headerStyle: {
         fontSize: '12px',
         outline: 'none',
      },
   },
]
