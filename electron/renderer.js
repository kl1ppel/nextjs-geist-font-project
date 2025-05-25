const { ipcRenderer } = require('electron');

const root = document.getElementById('root');

function createElement(tag, props = {}, ...children) {
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    } else if (key === 'className') {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  });
  return element;
}

let qrCodeImg = null;
let loggedIn = false;
let contacts = [];
let message = "Olá, esta é uma mensagem padrão do gerente bancário.";
let sending = false;
let progress = 0;

function render() {
  root.innerHTML = '';

  const title = createElement('h1', { className: 'title' }, 'WhatsApp Business Automation');
  root.appendChild(title);

  if (!loggedIn) {
    const loginSection = createElement('section', { className: 'login-section' },
      createElement('p', {}, 'Por favor, faça login no WhatsApp Business:'),
      qrCodeImg ? createElement('img', { src: qrCodeImg, alt: 'QR Code', width: 200, height: 200 }) : createElement('p', {}, 'Gerando QR Code...')
    );
    root.appendChild(loginSection);
  } else {
    const fileInput = createElement('input', { type: 'file', accept: '.xlsx, .xls', onchange: handleFileUpload });
    root.appendChild(fileInput);

    if (contacts.length > 0) {
      const contactsList = createElement('ul', { className: 'contacts-list' },
        ...contacts.map(phone => createElement('li', {}, phone))
      );
      root.appendChild(contactsList);
    }

    const messageTextarea = createElement('textarea', {
      rows: 4,
      value: message,
      oninput: (e) => {
        message = e.target.value;
      }
    }, message);
    root.appendChild(messageTextarea);

    const sendButton = createElement('button', {
      onclick: sendMessages,
      disabled: sending || contacts.length === 0
    }, sending ? `Enviando... ${progress}%` : 'Enviar Mensagens');
    root.appendChild(sendButton);
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    contacts = jsonData
      .map(row => row[0])
      .filter(phone => typeof phone === 'string' || typeof phone === 'number')
      .map(phone => phone.toString());
    render();
  };
  reader.readAsBinaryString(file);
}

async function sendMessages() {
  sending = true;
  render();
  for (let i = 0; i < contacts.length; i++) {
    const phone = contacts[i];
    try {
      await ipcRenderer.invoke('send-message', phone, message);
    } catch (error) {
      console.error(`Error sending message to ${phone}:`, error);
    }
    progress = Math.round(((i + 1) / contacts.length) * 100);
    render();
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  sending = false;
  render();
}

ipcRenderer.on('qr-code', (event, qr) => {
  qrCodeImg = qr;
  render();
});

ipcRenderer.on('client-ready', () => {
  loggedIn = true;
  qrCodeImg = null;
  render();
});

render();
