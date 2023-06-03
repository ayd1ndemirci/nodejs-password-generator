const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generatePassword(length, includeNumbers, includeSpecialChars) {
  let charset = "abcdefgğhıijklmnopqrstuvwxyzABCDEFGĞHIİJKLMNOPQRSTUVWXYZ";
  if (includeNumbers) {
    charset += "0123456789";
  }
  if (includeSpecialChars) {
    charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  }

  let password = '';
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    password += charset[randomIndex];
  }

  return password;
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createPassword() {
  let length = await prompt('Şifre uzunluğunu belirleyin: ');
  while (!/^\d+$/.test(length)) {
    console.log('Sadece sayısal değer girebilirsin! Tekrar dene.');
    length = await prompt('Şifre uzunluğunu belirleyin: ');
  }

  let includeNumbers = false;
  let numbersInput = await prompt('Sayılar içersin mi? (Evet: e / Hayır: h): ');
  while (!/^[eh]$/.test(numbersInput.toLowerCase())) {
    console.log('Sadece "e" veya "h" karakterlerini girebilirsin! Tekrar dene.');
    numbersInput = await prompt('Sayılar içersin mi? (Evet: e / Hayır: h): ');
  }
  includeNumbers = numbersInput.toLowerCase() === 'e';

  let includeSpecialChars = false;
  let specialCharsInput = await prompt('Özel karakterler içersin mi? (Evet: e / Hayır: h): ');
  while (!/^[eh]$/.test(specialCharsInput.toLowerCase())) {
    console.log('Sadece "e" veya "h" karakterlerini girebilirsin! Tekrar dene.');
    specialCharsInput = await prompt('Özel karakterler içersin mi? (Evet: e / Hayır: h): ');
  }
  includeSpecialChars = specialCharsInput.toLowerCase() === 'e';

  const password = generatePassword(parseInt(length), includeNumbers, includeSpecialChars);
  console.log('Oluşturulan Şifre: ' + password);

  let copyInput = await prompt('Bu şifreyi panoya kopyalamak ister misin? (Evet: e): ');
  if (copyInput.toLowerCase() === 'e') {
    try {
      if (process.platform === 'win32') {
        execSync(`echo ${password.trim()} | clip`, { windowsHide: true });
      } else {
        execSync(`echo ${password.trim()} | pbcopy`);
      }
      console.log('Şifre panoya kopyalandı.');
    } catch (error) {
      console.log('Hata: Şifre panoya kopyalanırken bir sorun oluştu.');
    }
  }

  rl.close();
}

createPassword();
