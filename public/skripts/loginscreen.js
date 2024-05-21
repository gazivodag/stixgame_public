
eventBus.on('pageload', () => {
    console.log("loginscreen??222?")
    var canvas = document.getElementById('gameCanvas'),
        ctx = canvas.getContext('2d');

    var clock;

    const width = canvas.getAttribute("width");
    const height = canvas.getAttribute("height");

    function measureText(str, fontType) {
        ctx.font = fontType;
        return ctx.measureText(str);
    }

    var inputUsername = "";
    var inputPassword = "";
    var inputFontSize = 24;
    var typingUserName = true;
    var measuredUserName = 0;
    var measuredPassword = 0;

    var gameName = "StixGame";
    var fontSize = 36;
    var measuredGameName = measureText(gameName, `${fontSize}px Courier`)

    var keyboardPress = (e) => {
        console.log(`loginscreen: i just typed a key ${e.key}`)

        if (e.key === "Enter")
            if (inputUsername.length > 0 && inputPassword.length > 0)
                eventBus.post("login", {"username": inputUsername, "password": inputPassword})
            else
                typingUserName = !typingUserName

        if (e.key === "Backspace")
            if (typingUserName && inputUsername.length > 0)
                inputUsername = inputUsername.substring(0, inputUsername.length - 1);
            else if (!typingUserName && inputPassword.length > 0)
                inputPassword = inputPassword.substring(0, inputPassword.length - 1);

        if (e.key.length > 1)
            return;

        if (typingUserName && inputUsername.length <= 16)
            inputUsername += e.key;
        else if (!typingUserName && inputPassword.length <= 16)
            inputPassword += e.key;

        measuredUserName = measureText(inputUsername, `${inputFontSize}px Courier`)
        measuredPassword = measureText(inputPassword, `${inputFontSize}px Courier`)
        measuredStatusText = measureText(statusText, `${measuredStatusSize}x Courier`)
    }

    function registerUserPassKeyboardListener() {
        canvas.addEventListener('keydown', keyboardPress);
    }

    function unregisterUserPassKeyboardListener() {
        canvas.removeEventListener('keydown', keyboardPress);
    }


    function renderGameName() {
        ctx.font = `${fontSize}px Courier`;
        var drawX = (width / 2) - (measuredGameName.width / 2);
        var drawY = height / 4;
        ctx.strokeStyle = "black";
        ctx.strokeText(gameName, drawX, drawY, measuredGameName.width, measuredGameName.height);
        ctx.fillStyle = "black";
        ctx.fillRect(drawX, drawY + 2, measuredGameName.width, 4)
    }

    function renderUsernamePasswordInput() {

        var boxWidth = 300;
        // var boxHeight = measuredGameName.height + 4;
        var boxHeight = 40;

        //username box
        ctx.fillStyle = "black";
        // console.log(boxHeight)
        ctx.fillRect(width / 2 - boxWidth / 2, height / 2, boxWidth, boxHeight);

        //drawing text
        ctx.strokeStyle = "white";
        ctx.font = `${inputFontSize}px Courier`;
        ctx.strokeText(inputUsername,
            width / 2 - boxWidth / 2 + 10,
            height / 2 + 28,
            measuredUserName.width,
            measuredUserName.height);

        //password
        ctx.fillRect(width / 2 - boxWidth / 2, height / 2 + boxHeight + 4, boxWidth, boxHeight);
        ctx.strokeText(inputPassword,
            width / 2 - boxWidth / 2 + 10,
            height / 2 + 70,
            measuredPassword.width,
            measuredPassword.height);

    }

    var statusText = "Press Enter to sign in";
    var measuredStatusSize = 30;
    var measuredStatusText = measureText(statusText, `${measuredStatusSize}x Courier`);
    function renderStatus()
    {
        ctx.font = `30px Courier`
        ctx.strokeStyle = "black";
        ctx.strokeText(statusText, width / 2 - measuredStatusText.width / 2, height / 2 - 40, measuredStatusText.width, measuredStatusText.height);
    }

    function renderLoginScreen() {
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, width, height)

        renderGameName();
        renderStatus();
        renderUsernamePasswordInput();
    }

    console.log("loginscreen: subscribing to clientLogin")
    eventBus.on('clientLogin', () => {
        console.log("login screen: client login: removing login screen")
        clearInterval(clock);
        clock = null;
        unregisterUserPassKeyboardListener();
    })

    eventBus.on('clientDisconnect', () => {
        clock = setInterval(() => renderLoginScreen(), 60);
    });

    console.log("login screen: running login screen clock");
    clock = setInterval(() => renderLoginScreen(), 60);
    registerUserPassKeyboardListener();
});

