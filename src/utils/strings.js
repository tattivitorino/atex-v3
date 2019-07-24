export const capitalizeFirstLetter = string => {
	return string[0].toUpperCase() + string.slice(1);
}

export const accentFold = input => {
	let s;
	let map = {
		à: "a",
		á: "a",
		â: "a",
		ã: "a",
		ä: "a",
		å: "a", // a
		ç: "c", // c
		è: "e",
		é: "e",
		ê: "e",
		ë: "e", // e
		ì: "i",
		í: "i",
		î: "i",
		ï: "i", // i
		ñ: "n", // n
		ò: "o",
		ó: "o",
		ô: "o",
		õ: "o",
		ö: "o",
		ø: "o", // o
		ß: "s", // s
		ù: "u",
		ú: "u",
		û: "u",
		ü: "u", // u
		ÿ: "y" // y
	}
	s = input.toLowerCase();
	if (!s) {
		return "";
	}
	let ret = "";
	for (var i = 0; i < s.length; i++) {
		ret += map[s.charAt(i)] || s.charAt(i);
	}
	return ret;
}

export const formatString = (value, type) => {
	let s = value;
	if (!s || !s.length) return s;
	s = s.toString();
	if (type == 'dt-br') {
		s = s.replace(/\D/g, "");
		s = s.replace(/(\d{2})(\d)/, "$1/$2");
		s = s.replace(/(\d{2})(\d)/, "$1/$2");
	}
	if (type == 'cpf') {
		s = s.replace(/\D/g, "");
		s = s.replace(/(\d{3})(\d)/, "$1.$2");
		s = s.replace(/(\d{3})(\d)/, "$1.$2");
		s = s.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
	}
	else if (type == 'cnpj') {
		s = s.replace(/\D/g, "");
		s = s.replace(/^(\d{2})(\d)/, "$1.$2");
		s = s.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
		s = s.replace(/\.(\d{3})(\d)/, ".$1/$2");
		s = s.replace(/(\d{4})(\d)/, "$1-$2");
	}
	else if (type == 'ddd-mobile') {
		s = s.replace(/\D/g, "");
		s = s.replace(/^(\d{2})(\d)/, "($1) $2");
		s = s.replace(/ (\d{5})(\d)/, " $1 $2");
	}
	else if (type == 'ddd-phone') {
		s = s.replace(/\D/g, "");
		s = s.replace(/^(\d{2})(\d)/, "($1) $2");
		s = s.replace(/ (\d{4})(\d)/, " $1 $2");
	}
	else if (type == 'cep') {
		s = s.replace(/\D/g, "");
		s = s.replace(/^(\d{5})(\d)/, "$1-$2");
	}
	else if (type == 'phone') {
		s = s.replace(/\D/g, "");
		if (s.length == 8) {
			s = s.replace(/^(\d{4})(\d)/, "$1 $2");
		} else {
			s = s.replace(/^(\d{5})(\d)/, "$1 $2");
		}
	}
	else if (type == 'nl2br') {
		s = s.replace(/\r?\n/g, '<br>');
	}
	return s;
}

export const textTruncate = (value, limit) => {
	return value.length > limit ? value.substring(0, limit) + '...' : value;
}

export const onlyNumbers = value => {
	return value.replace(/[^\d]+/g, '');
}

export const removeWhiteSpaces = value => {
	return (value || '').replace(/\s/g, '')
}

export const formatAddress = address => {
	const { logradouro, numero, complemento, bairro, cidade, estado } = address;
	let string = '';
	if (logradouro) string += logradouro;
	if (numero) string += `, ${numero}`;
	if (complemento) string += `, ${complemento}`;
	if (bairro) string += `\n${bairro}`;
	if (cidade) string += ` - ${cidade}`;
	if (estado) string += ` - ${estado}`;
	return string;
}

export const formatFileSize = (bytes, decimals, binaryUnits) => {
	if (bytes === 0) {
		return '0 Bytes';
	}
	const unitMultiple = (binaryUnits) ? 1024 : 1000;
	const unitNames = (unitMultiple === 1024) ? // 1000 bytes in 1 Kilobyte (KB) or 1024 bytes for the binary version (KiB)
		['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'] :
		['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
	return parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(decimals || 0)) + ' ' + unitNames[unitChanges];
}

export const formatConn = (connInfo) => {
	//console.log(connInfo);
	if (!connInfo) return 'Sem Informações sobre a conexão';
	if (connInfo.type === 'none') return 'SEM INTERNET';
	if (connInfo.type === 'wifi') return 'WIFI';
	if (connInfo.type === 'cellular') {
		let str = 'Celular - ';
		if (connInfo.effectiveType !== 'unknown') return str + connInfo.effectiveType;
	}
	return 'Conexão Desconhecida';
}