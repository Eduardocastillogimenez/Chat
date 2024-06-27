import CryptoJS from "crypto-js"; 

const CryptoJSAesJson = {
  stringify: function (cipherParams:any) {
      let j:any = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
      if (cipherParams.iv) {
        j.iv = cipherParams.iv.toString();
      }
      if (cipherParams.salt) j.s = cipherParams.salt.toString();
      return JSON.stringify(j);
  },
  parse: function (jsonStr:any) {
      let j = JSON.parse(jsonStr);
      let cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
      if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
      if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
      return cipherParams;
  }
}

export const cifrarTexto = (texto: string, email: string) => {
    if(!texto) {
        return null;
    }
  var textoCifrado = CryptoJS.AES.encrypt(texto, `messaging-${email}-key`).toString();
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(texto), `messaging-${email}-key`, {format: CryptoJSAesJson}).toString();
  return encrypted;
}
export  const descifrarTexto = (texto: string, email: string ) => {
    if(!texto) {
        return null;
    }
  var decrypted = JSON.parse(CryptoJS.AES.decrypt(texto, `messaging-${email}-key`, {format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
  return decrypted;
}

