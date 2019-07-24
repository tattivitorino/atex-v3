const pattern = /\(([0-9]{2}|0{1}((x|[0-9]){2}[0-9]{2}))\)\s*[0-9]{3,4}[- ]*[0-9]{4}/;
const ddd = /\(*[1-9]{1}[0-9]{1}\)*/;
const phone = /\s*[0-9]{4,5}[- ]*[0-9]{4}/;

const phoneBR = /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/;
const mobile = /^\([1-9]{2}\) 9[1-9]{1}[0-9]{3} [0-9]{4}$/;
/** 
  ^ - Início da string.
  \( - Um abre parênteses.
  [1-9]{2} - Dois dígitos de 1 a 9. Não existem códigos de DDD com o dígito 0.
  \) - Um fecha parênteses.
    - Um espaço em branco.
  (?:[2-8]|9[1-9]) - O início do número, representa uma escolha
  (a parte do [2-8])  entre o um dígito entre 2 e 8  
  (a parte do 9[1-9]) e de um 9 seguido de um dígito de 1 a 9 (a parte do 9[1-9]). 
  O | separa as opções a serem escolhidas. 
  O (?: ... ) agrupa tais escolhas. 
  Telefones fixos começam com dígitos de 2 a 8. Telefones celulares começam com 9 e têm um segundo dígito de 1 a 9. 
  O primeiro dígito nunca será 0 ou 1. Celulares não podem começar com 90 porque esse é o prefixo para ligações a cobrar.
  [0-9]{3} - Os demais três dígitos da primeira metade do número do telefone, perfazendo um total de 4 ou 5 dígitos na primeira metade.
  \- - Um hífen.
  [0-9]{4} - A segunda metade do número do telefone.
  $ - Final da string.
 */

const verifyCPF = cpf => {
  if (cpf === '' || cpf === null) return false;
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999")
    return false;

  let add = 0;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
    rev = 0;

  if (rev != parseInt(cpf.charAt(9)))
    return false;

  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
    rev = 0;
  if (rev != parseInt(cpf.charAt(10)))
    return false;

  return true;
}

const verifyCNPJ = cnpj => {
  if (cnpj == '' || cnpj == null) return false;

  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length != 14) return false;

  if (cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999") {
    return false;
  }

  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(1)) return false;

  return true;

}


export const validateRequired = value => value ? undefined : 'Campo Obrigatório'

export const validateCPF = value => value && verifyCPF(value) ? undefined : 'CPF Inválido'

export const validateCNPJ = value => value && verifyCNPJ(value) ? undefined : 'CNPJ Inválido'

export const validateMobile = value =>
  value && !mobile.test(value) ? 'Celular Inválido' : undefined

export const validateMaxLength = max => value =>
  value && value.length > max ? `Máximo  ${max} caracteres` : undefined

export const validateMaxLength15 = validateMaxLength(15)

export const validateNumber = value => value && isNaN(Number(value)) ? 'Número inválido' : undefined

export const validateMinValue = min => value =>
  value && value < min ? `Mínimo de ${min}` : undefined

export const validateMinValue18 = validateMinValue(18)

export const validateEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
    'Email inválido' : undefined


export const validateMaxValue = value =>
  value && value > 65 ? 'You might be too old for this' : undefined

export const validateAol = value =>
  value && /.+@aol\.com/.test(value) ?
    'Really? You still use AOL for your email?' : undefined;

export const validateMatchPasswords = (value, allValues) =>
  value !== allValues.password ? 'Suas senhas não conferem!' : undefined;

