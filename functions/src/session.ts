import * as admin from 'firebase-admin'

const me = {
  setAttributeById (sessionId: string, key: string, value: string) {
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
  },

  async getAttributeById (sessionId: string, key: string) {
    const docref = await admin
      .firestore()
      .collection('session')
      .doc(sessionId)
      .get()

    // const docref = await ref.get()
    let returnValue: any = {}
    if (!docref.exists) {
      return
    } else {
      returnValue = docref.data()
    }
    return returnValue[key]
  }
}

export default me

if (!module.parent) {
  // me.rail_check()
}
