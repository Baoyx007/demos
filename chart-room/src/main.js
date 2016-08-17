/**
 * Created by haven on 16/8/17.
 */

$(function () {
    let $window = $(window);
    let $usernameInput = $('.usernameInput'); // Input for username
    let username = ''

    let $loginPage = $('.login.page'); // The login page
    let $chatPage = $('.chat.page'); // The chatroom page

    let socket = io();


    $currentInput = $usernameInput.focus()


    $window.keydown(function (event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                sendMessage();
                socket.emit('stop typing');
                typing = false;
            } else {
                setUsername();
            }
        }
    });

    function setUsername() {
        username = cleanInput($usernameInput.val().trim());

        // If the username is valid
        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();
            // $loginPage.off('click');
            // $currentInput = $inputMessage.focus();

            // Tell the server your username
            socket.emit('add user', username);
        }
    }

    // Prevents input from having injected markup
    function cleanInput (input) {
        return $('<div/>').text(input).text();
    }
})