const axios = require('axios')
var qs = require('qs')
const API_ENDPOINT = 'https://q-saude--dev.my.salesforce.com/services'
const CLIENT_ID = ''
const CLIENT_SECRET = ''
const USERNAME = ''
const PASSWORD = ''
const path_token = '/oauth2/token'
const path_chamada = '/apexrest/SyncCobranca'
const header = { 
  'Content-Type': 'application/x-www-form-urlencoded', 
  'Cookie': 'BrowserId=5DfMMjT_Ee2REI2JGsISUw; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1'
}
const data = qs.stringify({
  client_id: CLIENT_ID, 
  client_secret: CLIENT_SECRET, 
  username: USERNAME, 
  password: PASSWORD, 
  grant_type: "password"
})

async function loginSales(){
  return await axios.post(`${API_ENDPOINT}${path_token}`, data, {headers: header})
  .then(function (response) {
    console.log('Logando')
    return response['data']['access_token']
  })
  .catch(function (error) {
    console.log(error)
  })
}

async function callToken(token){
  var data = JSON.stringify({
    "Boletos": [
      {
        "titleCode": "",
        "cpf": "",
        "Carteirinha": "",
        "ControlNumber": "",
        "createdDate": "",
        "dueDate": "",
        "paymentDate": "",
        "interestAmount": 0,
        "fineAmount": 0,
        "competenceMonth": "",
        "statusBankSlip": "",
        "titleAmount": 0,
        "paidAmount": 0,
        "url": "",
        "valorComDesconto": 0,
        "tipodeContratacao": ""
      }
    ]
  })
  
  var config = {
    method: 'post',
    url: 'https://q-saude--dev.my.salesforce.com/services/apexrest/SyncCobranca',
    headers: { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json', 
      'Cookie': 'BrowserId=5DfMMjT_Ee2REI2JGsISUw; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1'
    },
    data : data
  }
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error)
  })
}

async function main(){
    const a = await loginSales()
    console.log(a)
    const b = await callToken(a)
}
main()