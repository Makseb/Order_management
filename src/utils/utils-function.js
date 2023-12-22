import React, { useRef } from "react";


import { format, differenceInSeconds, parse, addSeconds } from 'date-fns';

export function getDifference(startTimeParam) {
  // start time
  const startTime = parse(startTimeParam, 'HH:mm:ss', new Date());

  // Add 180 seconds to the start time
  const newTime = addSeconds(startTime, 180);

  // Get the current time in HH:mm:ss format
  const currentTimeString = format(new Date(), 'HH:mm:ss');

  // Parse the current time string into a Date object
  const currentTime = parse(currentTimeString, 'HH:mm:ss', new Date());

  // Calculate the difference in seconds
  const difference = differenceInSeconds(newTime, currentTime);

  return difference

}

// reformulate items in order schema 
export function reformulateItems(items) {
  let data = []
  for (let i = 0; i < items.length; i++) {
    const optionsGroup = []
    for (let j = 0; j < items[i].options.length; j++) {
      const option = {
        _id: items[i].options[j]._id,
        id: items[i].options[j].id,
        name: items[i].options[j].name,
        price: items[i].options[j].price,
      }
      const idExistsIndex = optionsGroup.findIndex(item => item.optionGroupeId === items[i].options[j].optionGroupeId);
      if (idExistsIndex === -1) {
        optionsGroup.push({
          optionGroupeId: items[i].options[j].optionGroupeId,
          optionGroupeName: items[i].options[j].optionGroupeName,
          options: [option]
        });
      } else {
        optionsGroup[idExistsIndex].options.push(option);
      }
    }
    data.push({
      id: items[i].id,
      _id: items[i]._id,
      name: items[i].name,
      description: items[i].description,
      price: items[i].price,
      quantity: items[i].quantity,
      tax: items[i].tax,
      optionsGroup: optionsGroup
    })
  }
  return data
}

// export const PrintScreen = (order, currency) => {
//   return `<html>
//   <head>
//     <style>
//       /* Add your styles here */
//       body {
//         font-family: 'Roboto-Regular';
//       }
//       /* Add more styles as needed */
//     </style>
//   </head>
//   <body>
//     ${order.items.map((item, itemIndex) => `
//       <div key=${itemIndex}>
//         <div style="flex-direction : row; display : flex;justify-content: space-between;${itemIndex !== 0 && "padding-top : 8px"}">
//       <div style="font-size: 20px; color: #424242;font-family: Roboto-Regular;">
//         ${item.quantity}x ${item.name.charAt(0).toUpperCase() + item.name.slice(1)}
//       </div>
//       <div style="font-size: 16px; color: #424242; font-style: italic;font-family: Roboto-Regular">
//         ${item.price} ${currency}
//       </div>
//     </div>  
//     ${item.optionsGroup.map((optionGroup) => `
//           <div key=${optionGroup.optionGroupeId}>
//             <div style="padding-left: 18px; font-size: 16px; color: #7f7f7f;font-family : Roboto-Light;padding-top : 8px">
//               ${optionGroup.optionGroupeName.charAt(0).toUpperCase() + optionGroup.optionGroupeName.slice(1)}
//             </div>
//             ${optionGroup.options.map((option) => `
//               <div key=${option._id} style="flex-direction: row; justify-content: space-between; padding-left: 18px;">
//                 <span style="font-size: 16px; color: #424242; font-style: italic;Roboto-Regular;">
//                   +${option.name.charAt(0).toUpperCase() + option.name.slice(1)}
//                 </span>
//                 <span style="font-size: 16px; color: #424242; font-style: italic;Roboto-Regular;margin-left: 10px;">(+${option.price} ${currency})</span>
//               </div>
//             `).join('')}
//           </div>
//         `).join('')}
//       </div>
//     `).join('')}
//   </body>
//   <div style="display : flex;flex-direction : row;justify-content : space-between">
// <div></div>
// <div style="font-size: 20; color: #424242; font-style: italic;Roboto-Regular;padding-top:8px">Total price : ${order.price_total} ${currency}</div>
// </div>
// </html>
// `
// }

export default function escPosConvert(order, currency, image) {
  let escPosCommands = '';

  order.items.forEach((item) => {
    escPosCommands +=
      '[L]<b>' + item.quantity + 'x ' + item.name.charAt(0).toUpperCase() + item.name.slice(1) + '</b>[R]' + item.price + ' ' + currency + '\n';
    escPosCommands += '[L]\n' // i want to add another line here how ?

    item.optionsGroup.forEach((optionGroup) => {
      escPosCommands += '[L]  ' + optionGroup.optionGroupeName.charAt(0).toUpperCase() + optionGroup.optionGroupeName.slice(1) + '\n';

      escPosCommands += optionGroup.options.map((option, ind) => {
        return '[L]  +' + option.name.charAt(0).toUpperCase() + option.name.slice(1) + '[R]' + option.price + ' ' + currency + '\n';
      }).join('');

      escPosCommands += '[L]\n';
    });
  });


  return '[C]<img>' + image + '</img>\n' +
    '[L]\n' +
    "[L]      <u><font size='big'>ORDER ID : " + order._id.substring(order._id.length - 4) + "</font></u>\n" +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    escPosCommands +
    '[C]--------------------------------\n' +
    '[R]TOTAL PRICE :[R]' + order.price_total + ' ' + currency + '\n' +
    '[R]TAX :[R]4.23e\n' +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    "[L]<font size='tall'>Customer infos :</font>\n" +
    '[L]Name : ' + order.name + '\n' +
    '[L]Phone : ' + order.client_phone + '\n' +
    '[L]Email : ' + order.client_email + '\n' +
    '[L]Type : ' + order.type + '\n' +
    '[L]DeliveryAddress : ' + order.deliveryAdress + '\n' +
    '[L]Table : ' + order.table + '\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n'

  // "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
  // "[C]<qrcode size='20'>http://www.developpeur-web.dantsu.com/</qrcode>"

}