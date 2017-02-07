# selfbot
Some useless selfbot.

##Installation

(Make sure you have at least Node 7 installed.)

1. Open Terminal or, in Windows, CMD.
2. Run `git clone https://github.com/ViiRal/selfbot.git`.
3. After that, go to the folder you cloned it in, and look for `selfbot`
4. Go inside that folder and open the file named `selfiebot.js`.
5. Once opened, look for this line:

![Line 141](http://i.imgur.com/BvFVMe3.png)

Replace `"insert dir here"` with the directory to the bot file. Example: `"/Users/GuyCool/Documents/selfbot/selfiebot.js"`.

Next, scroll down to the very bottom of the file.

![Bottom (last) line](http://i.imgur.com/0Kr7JGx.png)

Replace `"puttokenhere"` with your token, example: `"MHsodfsjofdsf.sdfosdfjos.fGODfogsfOGfg"`. To grab your token, first go in the Discord App (or the web version, but make sure you're in chrome) and press:
* Ctrl + Shift + I in case you are in Windows, or
* If Mac, press Command + Option + I.

This will open developer tools.
Now do the following:

![Applications tab then Local Storage](http://i.imgur.com/v6axzdA.png)

(If you do not see the Applications tab, click the two arrows on the top right (They look like this: `»`) and select Applications.)

Now copy your token (the bunch of random letters next to the token field) and paste them in the spot said.
Assuming the token is `a.b.c.d.e.f`, the line would look like this:
```js
me.login("a.b.c.d.e.f");
```

Done! Now to start your bot, write this in Terminal/CMD **(DO NOT PRESS ENTER)**:
```
node --harmony
```
**then, Drag and Drop the `selfiebot.js` file into your Terminal/CMD window.** <- Important Step

Doing that step will add the bot file's path to your terminal. Assuming the file path is `/Users/GuyCool/Documents/selfbot/selfiebot.js`, it would then look like this:
```
node --harmony /Users/GuyCool/Documents/selfbot/selfiebot.js 
```
Now press enter. Done! Your selfbot has started on your account, if all steps have been followed correctly. ;)
