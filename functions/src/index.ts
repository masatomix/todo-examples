import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as request from 'request'
import * as cookie from 'cookie'
import oauthConfig from './oauthConfig'
import oidcConfig from './oidcConfig'

admin.initializeApp()

export const chat = functions.https.onRequest(async (req, res) => {
  await sendSlack()
  res.send('ok')
})

export const chat_pub = functions.pubsub
  .topic('slackChatTopic')
  .onPublish(async message => {
    await sendSlack()
  })

// $ gcloud pubsub topics publish slackChatTopic  --message '{"name":"Xenia"}'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const oauth = functions.https.onRequest(async (req, res) => {
  if (req.query.idToken) {
    // idTokenをチェックする必要あり
    try {
      await verifyIdToken(req.query.idToken)
    } catch (error) {
      console.log(error.message)
      res.status(400).send('idTokenが正しくありません00')
      return
    }
    addCookie(res, 'idToken', req.query.idToken)
    res.redirect('./oauth')
    return
  }

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

  // そもそもidTokenがなかったら後続を続ける意味がないので、正当性チェック verifyIdToken もここで実施
  const cookies = cookie.parse(req.headers.cookie || '')
  const idToken = cookies.idToken

  let userId = ''
  // idTokenをチェックする必要あり
  try {
    userId = await verifyIdToken(idToken)
  } catch (error) {
    console.log(error.message)
    res.status(400).send('idTokenが正しくありません12')
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

    setAttributeById(idToken, 'state', randomValue)
    res.redirect(authorization_endpoint_uri)
  } else {
    const csrf = await checkCSRF(req, res, idToken)
    if (!csrf) {
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

    console.log(userId)

    admin
      .firestore()
      .collection('slackToken')
      .doc(userId)
      .set(body)

    res.send('登録完了。ブラウザ閉じちゃってください。')
  }
})

function doRequest(option) {
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

function getRandomString() {
  var S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var N = 50
  const randomValue = Array.from(Array(N))
    .map(() => S[Math.floor(Math.random() * S.length)])
    .join('')
  return randomValue
}

async function verifyIdToken(idToken) {
  const decodedToken = await admin.auth().verifyIdToken(idToken)

  const iss_aud_check =
    decodedToken.iss == oidcConfig.iss && decodedToken.aud == oidcConfig.aud
  if (!iss_aud_check) {
    console.log(`iss(Expected): ${oidcConfig.iss}`)
    console.log(`iss(Actual  ): ${decodedToken.iss}`)
    console.log(`aud(Expected): ${oidcConfig.aud}`)
    console.log(`aud(Actual  ): ${decodedToken.aud}`)
    throw new Error('issもしくはaudが想定外でした')
  }
  return decodedToken.uid
}

async function checkCSRF(req, res, idToken) {
  const state = req.query.state

  // const cookies = cookie.parse(req.headers.cookie || '')
  // const sessionState = cookies.state

  const sessionState = await getAttributeById(idToken, 'state')

  console.log('requestState: ' + state)
  console.log('sessionState: ' + sessionState)
  return state === sessionState
}

function addCookie(res, key, value) {
  res.setHeader('Cache-Control', 'private') // Hosting経由だと、これがないとset cookieが削除される
  const expiresIn = 60 * 60 * 24
  const options = { maxAge: expiresIn, httpOnly: true }
  // const options = { maxAge: expiresIn, httpOnly: true, secure: true }
  res.setHeader('Set-Cookie', cookie.serialize(key, value, options))
}

async function sendSlack() {
  const querySnapshot = await admin
    .firestore()
    .collection('slackToken')
    .get()

  querySnapshot.forEach(doc => {
    const fbUserId = doc.id
    const jsonData = doc.data()

    const option = {
      url: 'https://slack.com/api/chat.postMessage',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jsonData.access_token}`
      },
      json: {
        channel: '#general',
        text: `${fbUserId} です、今日は！`
      }
    }
    request(option, (error, response, body) => {
      if (error) {
        console.log('error:', error)
        return
      }
      if (response && body) {
        console.log('status Code:', response && response.statusCode)
        console.log(body)
      }
    })
  })
}

function setAttributeById(sessionId: string, key: string, value: string) {
  // const ref = this.db.collection('todos').doc(key) // キー指定して
  const ref = admin
    .firestore()
    .collection('session')
    .doc(sessionId)

  ref.get().then(docref => {
    if (!docref.exists) {
      const target: any = {}
      target[key] = value
      // admin.firestore().collection('session').add(target)
      admin
        .firestore()
        .collection('session')
        .doc(sessionId)
        .set(target)
    } else {
      const target: any = docref.data()
      target[key] = value
      ref.set(target)
    }
  })
}

async function getAttributeById(sessionId: string, key: string) {
  const docref = await admin
    .firestore()
    .collection('session')
    .doc(sessionId)
    .get()

  // const docref = await ref.get()
  let returnValue: any = {}
  if (!docref.exists) {
    return null
  } else {
    returnValue = docref.data()
  }
  return returnValue[key]
}

// https://firebase.google.com/docs/hosting/functions
