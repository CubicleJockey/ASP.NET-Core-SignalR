﻿/*
 The following sample code uses modern ECMAScript 6 features 
 that aren't supported in Internet Explorer 11.
 To convert the sample for environments that do not support ECMAScript 6, 
 such as Internet Explorer 11, use a transpiler such as 
 Babel at http://babeljs.io/. 

 See Es5-chat.js for a Babel transpiled version of the following code:
*/
const MESSAGESLISTID = 'messagesList';

const connection = new signalR.HubConnectionBuilder()
    .withUrl('/chatHub')
    .build();

connection.on('ReceiveMessage', (user, message) => {

    const mesage = message.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;');

    const encodedMsg = `${user}, says ${mesage}`;

    const li = document.createElement('li');
    li.textContent = encodedMsg;

    document.getElementById(MESSAGESLISTID)
            .appendChild(li);

});

connection.start()
          .catch(error => console.error(error.toString()));

document.getElementById('sendButton')
    .addEventListener('click', event => {

    const user = document.getElementById('userInput').value;
    const message = document.getElementById('messageInput').value;
    connection.invoke('SendMessage', user, message)
              .catch(err => console.error(err.toString()));

        event.preventDefault();

    });

document.getElementById('clearButton')
    .addEventListener('click', event => {

        const messagesList = document.getElementById(MESSAGESLISTID);
        if (messagesList.hasChildNodes()) {
            messagesList.childNodes.forEach(function(item, index) {
                item.remove();
            });
        }

        event.preventDefault();
    });