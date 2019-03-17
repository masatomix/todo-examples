export default {
  client_id: '##SLACK CLIENT ID##',
  client_secret: '##SLACK CLIENT SECRET##',
  authorization_endpoint: 'https://slack.com/oauth/authorize',
  token_endpoint: 'https://slack.com/api/oauth.access',
  redirect_uri:
    'http://client.example.com:5001/##PROJECT ID##/us-central1/oauth',
  // redirect_uri: 'https://us-central1-##PROJECT ID##.cloudfunctions.net/oauth',
  scope: 'chat:write:user'
}
