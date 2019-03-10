import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as request from 'request'
import * as cookie from 'cookie'
import oauthConfig from './oauthConfig'

admin.initializeApp()

export const chat = functions.pubsub
  .topic('slackChatTopic')
  .onPublish(message => {
    admin
      .firestore()
      .collection('slackToken')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(`Firebase ID: ${doc.id} へSlack通知`)
          console.log(`token: ${JSON.stringify(doc.data())}`)
        })
      })
  })
// $ gcloud pubsub topics publish slackChatTopic  --message '{"name":"Xenia"}'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const oauth = functions.https.onRequest(async (req, res) => {
  const code = req.query.code

  // errorでリダイレクトされたとき
  // ユーザがキャンセルしたときはココなので、そこそこちゃんと実装しないと。。(今んとこ適当実装)
  if (req.query.error) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
    const message = `
error: ${req.query.error}
error_uri: ${req.query.error_uri}
error_description: ${req.query.error_description}
`
    res.send(message)
    return
  }

  // codeがなかったとき、まずは認可画面へ遷移
  if (!code) {
    const randomValue = getRandomString()
    console.log('randomValue: ' + randomValue)

    const authorization_endpoint_uri = [
      oauthConfig.authorization_endpoint,
      '?client_id=',
      oauthConfig.client_id,
      '&redirect_uri=',
      oauthConfig.redirect_uri,
      '&state=',
      randomValue,
      '&response_type=code',
      '&scope=',
      oauthConfig.scope
    ].join('')

    addCookie(res, 'state', randomValue)
    res.redirect(authorization_endpoint_uri)
  } else {
    if (!checkCSRF(req, res)) {
      res
        .status(400)
        .send('前回のリクエストと今回のstate値が一致しないため、エラー。')
      return
    }

    const formParams = {
      redirect_uri: oauthConfig.redirect_uri,
      client_id: oauthConfig.client_id,
      client_secret: oauthConfig.client_secret,
      grant_type: 'authorization_code',
      code: code
    }

    const options = {
      uri: oauthConfig.token_endpoint,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: formParams,
      json: true
    }

    const body: any = await doRequest(options)

    const cookies = cookie.parse(req.headers.cookie || '')
    const userId = cookies.userid

    console.log(userId)

    admin
      .firestore()
      .collection('slackToken')
      .doc(userId)
      .set(body)

    res.send('登録完了。ブラウザ閉じちゃってください。')
  }
})

function doRequest (option) {
  return new Promise((resolve, reject) => {
    request(option, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}

function getRandomString () {
  var S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var N = 50
  const randomValue = Array.from(Array(N))
    .map(() => S[Math.floor(Math.random() * S.length)])
    .join('')
  return randomValue
}

function checkCSRF (req, res) {
  const state = req.query.state

  const cookies = cookie.parse(req.headers.cookie || '')
  const sessionState = cookies.state

  console.log('requestState: ' + state)
  console.log('sessionState: ' + sessionState)
  return state === sessionState
}

function addCookie (res, key, value) {
  res.setHeader('Cache-Control', 'private') // Hosting経由だと、これがないとset cookieが削除される
  const expiresIn = 60 * 60 * 24
  const options = { maxAge: expiresIn, httpOnly: true }
  // const options = { maxAge: expiresIn, httpOnly: true, secure: true }
  res.setHeader('Set-Cookie', cookie.serialize(key, value, options))
}

// https://firebase.google.com/docs/hosting/functions
