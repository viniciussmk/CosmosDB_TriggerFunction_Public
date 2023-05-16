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

async function loginSales(context){
  return await axios.post(`${API_ENDPOINT}${path_token}`, data, {headers: header})
  .then(function (response) {
    context.log('Exibindo JSON: ')
    return response['data']['access_token']
  })
  .catch(function (error) {
    console.log(error)
  })
}

module.exports = async function chamada (context, documents) {
    if (!!documents && documents.length > 0) {
        context.log('Document Id: ', documents)
        var token = await loginSales(context)
        var data = JSON.stringify({
            "Boletos": [{
                "titleCode": documents[0]['TitleCode'],
                "cpf": documents[0]['CpfCnpj'],
                "Carteirinha": documents[0]['NumCard'],
                "ControlNumber": documents[0]['ControlNumber'],
                "createdDate": documents[0]['CreatedDate'],
                "dueDate": documents[0]['DueDate'],
                "paymentDate": documents[0]['PaymentDate'],
                "interestAmount": documents[0]['InterestAmount'],
                "fineAmount": documents[0]['FineAmount'],
                "competenceMonth": documents[0]['CompetenceMonth'],
                "statusBankSlip": documents[0]['StatusBankSlip'],
                "titleAmount": documents[0]['TitleAmount'],
                "paidAmount": documents[0]['PaidAmount'],
                "url": documents[0]['url'],
                "valorComDesconto": documents[0]['Discount'],
                "tipodeContratacao": documents[0]['ContractType']
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
        context.log(data)
        return await axios(config)
        .then(function (response) {
            context.log(JSON.stringify(response.data))
            context.log('Fim !!!')
        })
        .catch(function (error) {
            context.log(error)
        })
        
    }
}