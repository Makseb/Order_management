// // reformulate items in order schema 
export function reformulateItems(items) {
  let data = []
  for (let i = 0; i < items.length; i++) {
    const optionsGroup = []
    for (let j = 0; j < items[i].options.length; j++) {
      const option = {
        _id: items[i].options[j]._id,
        id: items[i].options[j].id,
        name: items[i].options[j].name,
        price_opt: items[i].options[j].price_opt,
        options: items[i].options[j].options,

        // 
        quantity: items[i].options[j].quantity,

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
      item_price: items[i].item_price,
      id: items[i].id,
      _id: items[i]._id,
      name: items[i].name,
      description: items[i].description,
      // price: items[i].price,
      size: items[i].size,
      quantity: items[i].quantity,
      tax: items[i].tax,
      optionsGroup: optionsGroup,
      note: items[i].note
    })
  }
  return data
}

export function reformulatePromo(promo) {
  let promos = []
  for (let k = 0; k < promo.length; k++) {
    let items = promo[k].items
    let data = []
    for (let i = 0; i < items.length; i++) {
      const optionsGroup = []
      for (let j = 0; j < items[i].options.length; j++) {
        const option = {
          _id: items[i].options[j]._id,
          id: items[i].options[j].id,
          name: items[i].options[j].name,
          price_opt: items[i].options[j].price_opt,
          options: items[i].options[j].options,
          // 
          quantity: items[i].options[j].quantity,
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
      // console.log("optionsGroup", optionsGroup);
      data.push({
        item_price: items[i].item_price,
        subtotal: items[i].subtotal,
        price_after_discount: items[i].price_after_discount,
        id: items[i].id,
        _id: items[i]._id,
        name: items[i].name,
        description: items[i].description,
        // price: items[i].price,
        size: items[i].size,
        quantity: items[i].quantity,
        tax: items[i].tax,
        optionsGroup: optionsGroup,
        note: items[i].note
      })
    }
    promos.push({ "items": data, "promo": promo[k].promoId })

  }

  return promos
}
// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function receipt(order, currency, store) {
  let escPosCommands = '';

  if (order.items.length > 0 && order.promo.length > 0) {
    escPosCommands +=
      '[C]<b>Non-Promotional Products\n\n';
  }

  order.items.forEach((item) => {
    escPosCommands +=
      '[L]<b>' + item.quantity + 'x ' + capitalizeFirstLetter(item.name) + '</b>[R]' + item.item_price + ' ' + currency + '\n';
    escPosCommands += '[L]\n'

    item.optionsGroup.forEach((optionGroup) => {
      escPosCommands += '[L] ' + capitalizeFirstLetter(optionGroup.optionGroupeName) + '\n';

      escPosCommands += optionGroup.options.map((option) => {
        let optionString = '[L]  +' + option.quantity + "x " + capitalizeFirstLetter(option.name) + '[R]' + option.price_opt + ' ' + currency + '\n';
        escPosCommands += '[L]\n'

        if (option.options.length > 0) {
          optionString += option.options.map((opt) => {
            return '[L]    -' + opt.quantity + 'x ' + capitalizeFirstLetter(opt.name) + '[R]' + opt.price + ' ' + currency + '\n';
          }).join('');
        }
        return optionString;
      }).join('');
    });
  });

  if (order.items.length > 0 && order.promo.length > 0) {
    escPosCommands +=
      '[L]\n';
  }

  order.promo.forEach((promo) => {
    escPosCommands +=
      '[C]<b>' + promo.promo.name + '\n';
    escPosCommands += '[L]\n'

    promo.items.forEach((item) => {
      escPosCommands +=
        '[L]<b>' + item.quantity + 'x ' + capitalizeFirstLetter(item.name) + '</b>[R]' + item.price_after_discount + ' ' + currency + '\n';
      escPosCommands += '[L]\n'

      item.optionsGroup.forEach((optionGroup) => {
        escPosCommands += '[L] ' + capitalizeFirstLetter(optionGroup.optionGroupeName) + '\n';

        escPosCommands += optionGroup.options.map((option) => {
          let optionString = '[L]  +' + option.quantity + "x " + capitalizeFirstLetter(option.name) + '[R]' + option.price_opt + ' ' + currency + '\n';
          escPosCommands += '[L]\n'

          if (option.options.length > 0) {
            optionString += option.options.map((opt) => {
              return '[L]    -' + opt.quantity + 'x ' + capitalizeFirstLetter(opt.name) + '[R]' + opt.price + ' ' + currency + '\n';
            }).join('');
          }
          return optionString;
        }).join('');
      });
      escPosCommands += '[R]Subtotal : ' + item.subtotal + ' ' + currency + "\n"
      escPosCommands += '[L]\n';
    });
  })
  return "[L]<u><font size='tall'>ORDER ID : " + order._id.substring(order._id.length - 4) + "</font></u>[R]for <b>" + order.type + "</b>\n" +
    '[L]\n' +
    '[L]Order at : ' + order.createdAt.date + " " + order.createdAt.time + "\n" +
    '[L]Prepared for : ' + order.preparedAt.date + " " + order.preparedAt.time + "\n" +
    '[L]\n' +
    '[L]\n' +
    "[C]<b><font size='tall'>" + store.name + "</font></b>\n" +
    '[C]' + store.address + "\n" +
    '[C]Phone : ' + store.phoneNumber + "\n" +
    '[C]SIRET : TVX301B\n' +
    '[L]\n' +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    escPosCommands +
    '[C]--------------------------------\n' +
    '[R]' + order.type + ' FEE :[R]' + (order.price_total - order.priceWithoutFee) + ' ' + currency + '\n' +
    '[R]PRICE HT :[R]' + order.priceHt_total + ' ' + currency + '\n' +
    '[R]TOTAL PRICE :[R]' + order.price_total + ' ' + currency + '\n' +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    "[L]<font size='tall'>Customer infos :</font>\n" +
    '[L]Name : ' + order.name + '\n' +
    '[L]Phone : ' + order.client_phone + '\n' +
    '[L]Email : ' + order.client_email + '\n' +
    '[L]DeliveryAddress : ' + order.deliveryAdress + '\n' +
    '[L]Table : ' + order.table + '\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n'
}
export function kitchen(order, currency) {
  let escPosCommands = '';

  if (order.items.length > 0 && order.promo.length > 0) {
    escPosCommands +=
      '[C]<b>Non-Promotional Products\n\n';
  }

  order.items.forEach((item) => {
    escPosCommands +=
      '[L]<b>' + item.quantity + 'x ' + capitalizeFirstLetter(item.name) + '</b>[R]' + item.item_price + ' ' + currency + '\n';
    escPosCommands += '[L]\n'

    item.optionsGroup.forEach((optionGroup) => {
      escPosCommands += '[L] ' + capitalizeFirstLetter(optionGroup.optionGroupeName) + '\n';

      escPosCommands += optionGroup.options.map((option) => {
        let optionString = '[L]  +' + option.quantity + "x " + capitalizeFirstLetter(option.name) + '[R]' + option.price_opt + ' ' + currency + '\n';
        escPosCommands += '[L]\n'

        if (option.options.length > 0) {
          optionString += option.options.map((opt) => {
            return '[L]    -' + opt.quantity + 'x ' + capitalizeFirstLetter(opt.name) + '[R]' + opt.price + ' ' + currency + '\n';
          }).join('');
        }
        return optionString;
      }).join('');
    });
  });

  if (order.items.length > 0 && order.promo.length > 0) {
    escPosCommands +=
      '[L]\n';
  }

  order.promo.forEach((promo) => {
    escPosCommands +=
      '[C]<b>' + promo.promo.name + '\n';
    escPosCommands += '[L]\n'

    promo.items.forEach((item) => {
      escPosCommands +=
        '[L]<b>' + item.quantity + 'x ' + capitalizeFirstLetter(item.name) + '</b>[R]' + item.price_after_discount + ' ' + currency + '\n';
      escPosCommands += '[L]\n'

      item.optionsGroup.forEach((optionGroup) => {
        escPosCommands += '[L] ' + capitalizeFirstLetter(optionGroup.optionGroupeName) + '\n';

        escPosCommands += optionGroup.options.map((option) => {
          let optionString = '[L]  +' + option.quantity + "x " + capitalizeFirstLetter(option.name) + '[R]' + option.price_opt + ' ' + currency + '\n';
          escPosCommands += '[L]\n'

          if (option.options.length > 0) {
            optionString += option.options.map((opt) => {
              return '[L]    -' + opt.quantity + 'x ' + capitalizeFirstLetter(opt.name) + '[R]' + opt.price + ' ' + currency + '\n';
            }).join('');
          }
          return optionString;
        }).join('');
      });
      escPosCommands += '[R]Subtotal : ' + item.subtotal + ' ' + currency + "\n"
      escPosCommands += '[L]\n';
    });
  })

  return "[L]<u><font size='tall'>ORDER ID : " + order._id.substring(order._id.length - 4) + "</font></u>[R]for <b>" + order.type + "</b>\n" +
    '[L]\n' +
    '[L]Order at : ' + order.createdAt.date + " " + order.createdAt.time + "\n" +
    '[L]Prepared for : ' + order.preparedAt.date + " " + order.preparedAt.time + "\n" +
    '[L]\n' +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    escPosCommands +
    '[C]--------------------------------\n' +
    '[R]' + order.type + ' FEE :[R]' + (order.price_total - order.priceWithoutFee) + ' ' + currency + '\n' +
    '[R]PRICE HT :[R]' + order.priceHt_total + ' ' + currency + '\n' +
    '[R]TOTAL PRICE :[R]' + order.price_total + ' ' + currency + '\n' +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    "[L]<font size='tall'>Customer infos :</font>\n" +
    '[L]Name : ' + order.name + '\n' +
    '[L]Phone : ' + order.client_phone + '\n' +
    '[L]Email : ' + order.client_email + '\n' +
    '[L]DeliveryAddress : ' + order.deliveryAdress + '\n' +
    '[L]Table : ' + order.table + '\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n'
}


export function kitchenbluetooth(order, currency) {
  let escPosCommands = '';

  if (order.items.length > 0 && order.promo.length > 0) {
    escPosCommands +=
      'Non-Promotional Products\n\n';
  }

  order.items.forEach((item) => {
    escPosCommands +=
      item.quantity + 'x ' + capitalizeFirstLetter(item.name) + '    ' + item.item_price + ' ' + currency + '\n';
    escPosCommands += '\n'

    item.optionsGroup.forEach((optionGroup) => {
      escPosCommands += ' ' + capitalizeFirstLetter(optionGroup.optionGroupeName) + '\n';

      escPosCommands += optionGroup.options.map((option) => {
        let optionString = '  +' + option.quantity + "x " + capitalizeFirstLetter(option.name) + '    ' + option.price_opt + ' ' + currency + '\n';
        escPosCommands += '\n'

        if (option.options.length > 0) {
          optionString += option.options.map((opt) => {
            return '    -' + opt.quantity + 'x ' + capitalizeFirstLetter(opt.name) + '    ' + opt.price + ' ' + currency + '\n';
          }).join('');
        }
        return optionString;
      }).join('');
    });
  });

  if (order.items.length > 0 && order.promo.length > 0) {
    escPosCommands +=
      '\n';
  }

  order.promo.forEach((promo) => {
    escPosCommands +=
      promo.promo.name + '\n';
    escPosCommands += '\n'

    promo.items.forEach((item) => {
      escPosCommands +=
        item.quantity + 'x ' + capitalizeFirstLetter(item.name) + '    ' + item.price_after_discount + ' ' + currency + '\n';
      escPosCommands += '\n'

      item.optionsGroup.forEach((optionGroup) => {
        escPosCommands += ' ' + capitalizeFirstLetter(optionGroup.optionGroupeName) + '\n';

        escPosCommands += optionGroup.options.map((option) => {
          let optionString = '  +' + option.quantity + "x " + capitalizeFirstLetter(option.name) + '    ' + option.price_opt + ' ' + currency + '\n';
          escPosCommands += '\n'

          if (option.options.length > 0) {
            optionString += option.options.map((opt) => {
              return '    -' + opt.quantity + 'x ' + capitalizeFirstLetter(opt.name) + '    ' + opt.price + ' ' + currency + '\n';
            }).join('');
          }
          return optionString;
        }).join('');
      });
      escPosCommands += 'Subtotal : ' + item.subtotal + ' ' + currency + "\n"
      escPosCommands += '\n';
    });
  })

  return "ORDER ID : " + order._id.substring(order._id.length - 4) + "               for " + order.type + "\n" +
    '\n' +
    'Order at : ' + order.createdAt.date + " " + order.createdAt.time + "\n" +
    'Prepared for : ' + order.preparedAt.date + " " + order.preparedAt.time + "\n" +
    '\n' +
    '\n' +
    '================================\n' +
    '\n' +
    escPosCommands +
    '--------------------------------\n' +
    '' + order.type + ' FEE :' + (order.price_total - order.priceWithoutFee) + ' ' + currency + '\n' +
    'PRICE HT :' + order.priceHt_total + ' ' + currency + '\n' +
    'TOTAL PRICE :' + order.price_total + ' ' + currency + '\n' +
    '\n' +
    '================================\n' +
    '\n' +
    "Customer infos :\n" +
    'Name : ' + order.name + '\n' +
    'Phone : ' + order.client_phone + '\n' +
    'Email : ' + order.client_email + '\n' +
    'DeliveryAddress : ' + order.deliveryAdress + '\n' +
    'Table : ' + order.table + '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +

    '\n'
}

export function receiptbluetooth(order, currency,store) {
  let escPosCommands = '';

  if (order.items.length > 0 && order.promo.length > 0) {
    escPosCommands +=
      'Non-Promotional Products\n\n';
  }

  order.items.forEach((item) => {
    escPosCommands +=
      item.quantity + 'x ' + capitalizeFirstLetter(item.name) + '    ' + item.item_price + ' ' + currency + '\n';
    escPosCommands += '\n'

    item.optionsGroup.forEach((optionGroup) => {
      escPosCommands += ' ' + capitalizeFirstLetter(optionGroup.optionGroupeName) + '\n';

      escPosCommands += optionGroup.options.map((option) => {
        let optionString = '  +' + option.quantity + "x " + capitalizeFirstLetter(option.name) + '    ' + option.price_opt + ' ' + currency + '\n';
        escPosCommands += '\n'

        if (option.options.length > 0) {
          optionString += option.options.map((opt) => {
            return '    -' + opt.quantity + 'x ' + capitalizeFirstLetter(opt.name) + '    ' + opt.price + ' ' + currency + '\n';
          }).join('');
        }
        return optionString;
      }).join('');
    });
  });

  if (order.items.length > 0 && order.promo.length > 0) {
    escPosCommands +=
      '\n';
  }

  order.promo.forEach((promo) => {
    escPosCommands +=
      promo.promo.name + '\n';
    escPosCommands += '\n'

    promo.items.forEach((item) => {
      escPosCommands +=
        item.quantity + 'x ' + capitalizeFirstLetter(item.name) + '    ' + item.price_after_discount + ' ' + currency + '\n';
      escPosCommands += '\n'

      item.optionsGroup.forEach((optionGroup) => {
        escPosCommands += ' ' + capitalizeFirstLetter(optionGroup.optionGroupeName) + '\n';

        escPosCommands += optionGroup.options.map((option) => {
          let optionString = '  +' + option.quantity + "x " + capitalizeFirstLetter(option.name) + '    ' + option.price_opt + ' ' + currency + '\n';
          escPosCommands += '\n'

          if (option.options.length > 0) {
            optionString += option.options.map((opt) => {
              return '    -' + opt.quantity + 'x ' + capitalizeFirstLetter(opt.name) + '    ' + opt.price + ' ' + currency + '\n';
            }).join('');
          }
          return optionString;
        }).join('');
      });
      escPosCommands += 'Subtotal : ' + item.subtotal + ' ' + currency + "\n"
      escPosCommands += '\n';
    });
  })

  return "ORDER ID : " + order._id.substring(order._id.length - 4) + "               for " + order.type + "\n" +
    '\n' +
    'Order at : ' + order.createdAt.date + " " + order.createdAt.time + "\n" +
    'Prepared for : ' + order.preparedAt.date + " " + order.preparedAt.time + "\n" +
    '\n' +
    '\n' +
    store.name + "\n" +
    store.address + "\n" +
    'Phone : ' + store.phoneNumber + "\n" +
    'SIRET : TVX301B\n' +
    '\n'+
    '\n'+
    '================================\n' +
    '\n' +
    escPosCommands +
    '--------------------------------\n' +
    '' + order.type + ' FEE :' + (order.price_total - order.priceWithoutFee) + ' ' + currency + '\n' +
    'PRICE HT :' + order.priceHt_total + ' ' + currency + '\n' +
    'TOTAL PRICE :' + order.price_total + ' ' + currency + '\n' +
    '\n' +
    '================================\n' +
    '\n' +
    "Customer infos :\n" +
    'Name : ' + order.name + '\n' +
    'Phone : ' + order.client_phone + '\n' +
    'Email : ' + order.client_email + '\n' +
    'DeliveryAddress : ' + order.deliveryAdress + '\n' +
    'Table : ' + order.table + '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n'
}
