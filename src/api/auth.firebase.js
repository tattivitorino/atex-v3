import firebase from 'firebase';

export const fetchUserState = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth()
      .onAuthStateChanged(res => {
        //console.log(res)
        if (res) resolve(res);
        else reject({ message: 'Usuário não logado' });
        unsubscribe();
      });
  })
}

export const login = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(result => {
      return Promise.resolve(result.user);
    })
    .catch(err => {
      const msg = getErrorMessageByCode(err.code);
      return Promise.reject({ message: msg })
    })
}

export const logout = () => {
  return firebase.auth().signOut()
    .then(() => {
      return Promise.resolve(true);
    })
    .catch(err => {
      return Promise.reject(err.message)
    })
}

export const recoverPassword = (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(true)
    }, 2000)
  })
}

// ***************** HELPER FUNCTIONS ********************

const getErrorMessageByCode = (code) => {
  switch (code) {
    case 'auth/wrong-password':
      return 'A Senha está incorreta';
    case 'auth/user-not-found':
      return 'Usuário não encontrado';
    default:
      return 'Erro desconhecido';
  }
}