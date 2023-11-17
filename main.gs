const TOKEN = ""
const WEBAPPURL = ""

const DOC = SpreadsheetApp.openById("");
const USDTSheet_BOUGHT = DOC.getSheetByName("");
const USDTSheet_SOLD = DOC.getSheetByName("");

const BOUGHT = "#купил";
const SOLD = "#продал";

const numberRegex = /(\d{1,3}(?: \d{3})*)(?:[,\.\s])?(\d+(?:\.\d+)?)(?:\s(\d{1,3}(?: \d{3})*))?/g;

function send (msg, chat_id) {
  let payload = {
  'method': 'sendMessage',
  'chat_id': String(chat_id),
  'text': msg,
  'parse_mode': 'HTML'
  }
  let data = {
    'method': 'post',
    'payload': payload
  }
  UrlFetchApp.fetch('https://api.telegram.org/bot' + TOKEN + '/', data);
}


function doPost(e) {
  const update = JSON.parse(e.postData.contents);
  let msgData = {}
  if (update.hasOwnProperty('message')) {
    msgData = {
      id         : update.message.message_id,
      chat_id    : update.message.chat.id,
      chat_name  : update.message.chat.title,
      text       : update.message.text,
      date       : (update.message.date/86400)+25569.125,
      is_msg     : true
    }
  }
  dataHandler(msgData);
}

function dataHandler(msgData) {
  let amount, currency, dirhamSum, operationType;

  let numberValues = (msgData.text).match(numberRegex);

  if (numberValues && numberValues.length >= 3) {
  // Extract and parse the matched numbers, preserving spaces
    amount = numberValues[0].replace(',', '.');
    currency = numberValues[1].replace(',', '.');
    dirhamSum = numberValues[2].replace(',', '.');
  } else {
    // let msg = "Неверный формат";
    // send(msg, msgData.chat_id);
    return;
  }

  if ((msgData.text).startsWith(BOUGHT)) {
    operationType = BOUGHT;  
  } else if ((msgData.text).startsWith(SOLD)) {
    operationType = SOLD;
  }

  let handledData = {
    date          : msgData.date,
    chatName      : msgData.chat_name,
    operationType : operationType,
    amount        : amount,
    currency      : currency,
    dirhamSum     : dirhamSum,
    chat_id       : msgData.chat_id,
  }
  
  saveData(handledData)
}

function saveData(handledData) {
  const vals = [ 
    handledData.date, 
    handledData.chatName, 
    handledData.operationType, 
    handledData.amount, 
    handledData.currency, 
    handledData.dirhamSum, 
    "-" + handledData.dirhamSum
    ];

  if (vals[2] == BOUGHT) {
    USDTSheet_BOUGHT.appendRow(vals);
  } else {
    USDTSheet_SOLD.appendRow(vals);
  }
  // let msg = "Записано";
  // send(msg, handledData.chat_id);
}

function api_connector () {
  let response = UrlFetchApp.fetch("https://api.telegram.org/bot"+TOKEN+"/setWebHook?url="+WEBAPPURL);
}





