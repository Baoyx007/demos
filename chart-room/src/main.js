/**
 * Created by haven on 16/8/17.
 */

$(function () {
    const FADE_TIME = 150
    const COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    let $window = $(window);
    let $usernameInput = $('.usernameInput'); // Input for username
    let $inputMessage = $('.inputMessage'); // Input message input box
    var $messages = $('.messages'); // Messages area
    let username = ''
    let userArray = ['1q']
    let typing
    let connected = false

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

    function sendMessage() {
        msg = cleanInput($inputMessage.val())

        if (msg) {
            $inputMessage.val('');
            addChatMessage({
                username: username,
                message: msg
            });
            // tell server to execute 'new message' and send along one parameter
            socket.emit('new message', msg);
        }
    }

    function addChatMessage (data, options) {
        // Don't fade the message in if there is an 'X was typing'
        // var $typingMessages = getTypingMessages(data);
        options = options || {};
        // if ($typingMessages.length !== 0) {
        //     options.fade = false;
        //     $typingMessages.remove();
        // }

        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .addClass(typingClass)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    function setUsername() {
        username = cleanInput($usernameInput.val().trim());

        // If the username is valid
        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();

            // Tell the server your username
            socket.emit('add user', username);
        }
    }

    // Prevents input from having injected markup
    function cleanInput(input) {
        return $('<div/>').text(input).text();
    }


    socket.on('login!', function (data) {
        connected = true;
        // Display the welcome message
        // console.log(login)
        var message = "Welcome to byx Chat space – " + username;
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
        addParticipants(data)
        // vm.userArray.push(username)
    });

    socket.on('user joined', function (data) {
        log(data.username + ' joined');
        addParticipantsMessage(data);
        vm.userArray.push(data.username)
    });

    // Log a message
    function log(message, options) {
        var $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }

    socket.on('user left', function (data) {
        log(data.username + ' left');
        addParticipantsMessage(data);
        let removeIndex = vm.userArray.indexOf(data.username)
        if (removeIndex && removeIndex > -1) {
            vm.userArray.splice(removeIndex, 1)
        }

        // removeChatTyping(data);
    });

    socket.on('new message', function (data) {
        addChatMessage(data);
    });

    function addMessageElement(el, options) {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    function addParticipantsMessage(data) {
        var message = '';
        if (data.userNumbers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.userNumbers + " participants";
        }
        log(message);
    }

    function addParticipants(data) {
        console.log(data.userArray)
        vm.userArray = data.userArray
        // log(data.userArray.join(','))
        // userArray.push(username)
    }

    // Gets the 'X is typing' messages of a user
    function getTypingMessages(data) {
        return $('.typing.message').filter(function (i) {
            return $(this).data('username') === data.username;
        });
    }

    // Removes the visual chat typing message
    function removeChatTyping(data) {
        getTypingMessages(data).fadeOut(function () {
            $(this).remove();
        });
    }

    function getUsernameColor (username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    let vm = new Vue({
        el: '#member',
        data: {
            userArray: userArray
        }
    })
})