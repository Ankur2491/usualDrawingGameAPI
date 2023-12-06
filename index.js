var express = require('express');
var socket = require('socket.io');
// const Cors = require('cors');
var app = express();
var wordList = { "words": ["world", "tea", "mochi", "stickers", "candy", "ucla", "bruins", "computer", "keyboard", "mouse", "cup", "bottle", "chips", "napkin", "earbuds", "mirror", "shadow", "photo", "horse", "cat", "dog", "cow", "goat", "corgi", "squirrel", "unicorn", "stairs", "ladder", "phone", "book", "driver", "nail", "neck", "hand", "harp", "football", "soccer", "tennis", "swimmer", "golf", "ticket", "magic", "snake", "braces", "crutches", "cast", "singer", "desk", "cape", "hero", "fish", "dancer", "pie", "cupcake", "teacher", "student", "star", "adult", "airplane", "apple", "pear", "peach", "baby", "backpack", "bathtub", "bird", "button", "carrot", "chess", "circle", "clock", "clown", "coffee", "comet", "compass", "diamond", "drums", "ears", "elephant", "feather", "fire", "garden", "gloves", "grapes", "hammer", "highway", "spider", "kitchen", "knife", "map", "maze", "money", "rich", "needle", "onion", "painter", "perfume", "prison", "potato", "rainbow", "record", "robot", "rocket", "rope", "sandwich", "shower", "spoon", "sword", "teeth", "tongue", "triangle", "umbrella", "vacuum", "vampire", "werewolf", "water", "window", "worm", "bones", "cannon", "whistle", "brick", "volcano", "stamp", "flowers", "boat", "rain", "stretch", "farm", "soap", "tape", "suit", "tie", "egg", "bucket", "monkey", "shark", "pizza", "couch", "skirt", "cactus", "milk", "cookie", "bait", "boil", "wax", "comb", "mask", "stick", "bat", "cloud", "sneeze", "sick", "you", "saw", "shoe", "staple", "butter", "bell", "sponge", "train", "mail", "thunder", "cheese", "turkey", "snow", "mountain", "giraffe", "roof", "drawing", "fishing", "penguin", "hat", "balloon", "earring", "garbage", "ketchup", "nametag", "waffle", "music", "concert", "comic", "check", "zebra", "zit", "yolk", "quilt", "open", "lemon", "kiss", "jar", "archer", "bow", "igloo", "lion", "lake", "idea", "wedding", "bridge", "bunny", "truck", "grass", "door", "bread", "bowl", "bracelet", "lollipop", "moon", "doll", "orange", "bike", "pen", "shell", "corn", "chicken", "purse", "glasses", "turtle", "pencil", "dinosaur", "head", "snowman", "ant", "cupcake", "chair", "leaf", "bed", "snail", "baby", "bus", "cherry", "crab", "branch", "pretzel", "brain", "knee", "owl", "gate", "snowball", "flute", "suitcase", "pajamas", "hook", "fries", "bees", "tv", "toe", "chalk", "boot", "ring", "plate", "pool", "burger", "toast", "salt", "pepper", "ski", "dance", "chair", "table", "scissors", "car", "kick", "camera", "sleep", "pillow", "doll", "stop", "draw", "wave", "brush", "cereal", "pasta", "baseball", "watch", "speaker", "glasses", "eraser", "paper", "letter", "gum", "crown", "sun", "ghost", "banana", "bug", "book", "light", "tree", "lips", "slide", "socks", "smile", "swing", "coat", "heart", "ocean", "kite", "mouth", "duck", "eyes", "mouse", "ball", "house", "star", "nose", "bed", "jacket", "shirt", "beach", "egg", "face", "cone", "web", "tutu", "lock", "candle", "dandruff", "dentist", "bubble", "towel", "sink", "toilet", "shampoo", "mohawk", "mask", "tire", "loop", "lung", "paint", "camp", "cane", "safe", "wink", "police", "sign", "eyebrow", "bookmark", "blonde", "pot", "canada", "usa", "goatee", "unicycle", "pole", "locker", "camel", "thorn", "cowboy", "vine", "kayak", "poster", "space", "power", "sledding", "horn", "bacon", "saturn", "dress", "elbow", "piano", "box", "stapler", "pinata", "dominos", "ticket", "juggle", "south", "afro", "bus", "north", "winner", "claw", "fan", "broom", "hair", "helmet", "wind", "pants", "tattoo", "freckle", "pirate", "river", "square", "hexagon", "pentagon", "cube", "sphere", "sunrise", "sunset", "fountain", "belt", "ladybug", "kitten", "cry", "graph", "goldfish", "arrow", "barber", "tornado", "puddle", "ruler", "dart", "elevator", "pig", "swimsuit", "bikini", "shorts", "mow", "window", "popcorn", "postcard", "beanbag", "dice", "moon", "floss", "panda", "pizza", "bandaid", "sky", "coconut", "bowling", "flag", "fridge", "freezer", "toaster", "starfish", "vote", "fang", "tomato", "can", "crab", "smoke", "mushroom", "shadow", "happy", "hoe", "barbwire", "shovel", "puzzle", "pocket", "drool", "green", "oval", "key", "wings", "braid", "tail", "curtain", "dragon", "peace", "straw", "scarf", "acorn", "pearl", "volcano", "leash", "forest", "pyramid", "coin", "trophy", "bald", "shoelace", "beard", "mustache", "santa", "eyelash", "statue", "dream", "mermaid", "island", "clown", "octopus", "disco", "needle", "bun"] };
// app.use(Cors())
var server = app.listen(4000, () => {
    console.log('listening on port 4000');
})
var io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});
userrooms = {};
users = [];
connections = [];
rooms = [];
masterRoomData = {};
io.on('connection', (socket) => {
    console.log("Connected", socket.id);
    socket.on('drawing', (data) => {
        data[4] = socket.id;
        io.sockets.in('room-' + socket.roomnum).emit("receivedDoodle", data);
    });
    socket.on('clearAll', (data) => {
        data = socket.id;
        io.sockets.in('room-' + socket.roomnum).emit("clearedFromServer", data);
    })
    socket.on('new_user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
    });
    socket.on('new_room', (data, callback) => {
        callback(true);
        socket.roomnum = data;
        socket.join("room-" + socket.roomnum);
        userrooms[data] = [];
        userrooms[data].push(socket.id);
        // console.log(userrooms);
        let hostData = { socketName: socket.username, "userRoom": userrooms }
        // io.emit("setHost",hostData);
        if (!rooms.includes(socket.roomnum)) {
            rooms.push(socket.roomnum);
            if (masterRoomData['room-' + socket.roomnum] == undefined) {
                masterRoomData['room-' + socket.roomnum] = {};
                masterRoomData['room-' + socket.roomnum]['host'] = socket.username;
                masterRoomData['room-' + socket.roomnum]['hostId'] = socket.id;
                masterRoomData['room-' + socket.roomnum]['users'] = [];
                masterRoomData['room-' + socket.roomnum]['users'].push(socket.username);
                io.sockets.in('room-' + socket.roomnum).emit('currentUsers', masterRoomData['room-' + socket.roomnum]['users']);
                io.sockets.in('room-' + socket.roomnum).emit('setHost', hostData);
                // io.sockets.in('room-' + socket.roomnum).emit('start_game',socket.id);
            }
        }
    });

    socket.on('join_room', (data, callback) => {
        callback(true);
        socket.roomnum = data;
        socket.join("room-" + socket.roomnum);
        if (userrooms[socket.roomnum])
            userrooms[socket.roomnum].push(socket.id);
        if (rooms.includes(socket.roomnum)) {
            if (masterRoomData['room-' + socket.roomnum]['users'].length > 0) {
                let users = masterRoomData['room-' + socket.roomnum]['users'];
                users.push(socket.username);
                masterRoomData['room-' + socket.roomnum]['users'] = users;
                // io.emit('currentUsers',masterRoomData['room-' + socket.roomnum]['users']);
                let hostData = { socketName: masterRoomData['room-' + socket.roomnum]['host'], "userRoom": userrooms };
                io.sockets.in('room-' + socket.roomnum).emit('currentUsers', masterRoomData['room-' + socket.roomnum]['users']);
                // console.log(hostData);
                io.sockets.in('room-' + socket.roomnum).emit('setHost', hostData);
                if (masterRoomData['room-' + socket.roomnum]['users'].length == 2) {
                    io.sockets.in('room-' + socket.roomnum).emit('start_game', masterRoomData['room-' + socket.roomnum]['hostId']);
                }
                // io.emit("setHost", hostData);
            }
        }
    });

    socket.on('disconnect', (data) => {
        if (masterRoomData['room-' + socket.roomnum]) {
            let sUsers = userrooms[socket.roomnum];
            sUsers.splice(sUsers.indexOf(socket.id), 1);
            if (sUsers.length > 0)
                userrooms[socket.roomnum] = sUsers;
            let users = masterRoomData['room-' + socket.roomnum]['users'];
            modifiedUsers = users.filter((item) => item != socket.username);
            masterRoomData['room-' + socket.roomnum]['users'] = modifiedUsers;
            if (modifiedUsers.length == 0) {
                delete masterRoomData['room-' + socket.roomnum];
                delete userrooms[socket.roomnum];
                rooms.splice(rooms.indexOf(socket.roomnum), 1);
            }
            else {
                io.sockets.in('room-' + socket.roomnum).emit('currentUsers', masterRoomData['room-' + socket.roomnum]['users']);
            }
        }
    })
    socket.on('pick_drawer', (data, callback) => {
        let words = wordList.words;
        const randomWord = words[Math.floor(Math.random() * words.length)];
        let users = userrooms[data];
        let user_index = Math.floor(Math.random() * users.length);
        const randomUser = users[user_index];
        masterRoomData['room-' + socket.roomnum]['userIndex'] = user_index;
        masterRoomData['room-' + socket.roomnum]['currentDrawer'] = randomUser;
        let obj = { 'socketId': randomUser, 'word': randomWord };
        io.sockets.in('room-' + socket.roomnum).emit('currentDrawer', obj);
        startTimer(socket.roomnum);
        callback(randomUser);
    })
    function startTimer(roomnum) {
        let counter = 45;
        masterRoomData['room-' + socket.roomnum]['timer'] = setInterval(() => {
            io.sockets.in('room-' + roomnum).emit('timeRemaining', counter--);
        }, 1000);
    }
    socket.on('stop_timer', (data) => {
        if (data == masterRoomData['room-' + socket.roomnum]['currentDrawer']) {
            clearInterval(masterRoomData['room-' + socket.roomnum]['timer']);
            io.sockets.in('room-' + socket.roomnum).emit("clearDrawer", masterRoomData['room-' + socket.roomnum]['currentDrawer'])
            setTimeout(() => { nextRound(socket.roomnum) }, 3000);
        }
    })
    socket.on('correct_guess', (data) => {
        if (masterRoomData['room-' + socket.roomnum]['winners'] == undefined) {
            masterRoomData['room-' + socket.roomnum]['winners'] = [];
        }
        if (!masterRoomData['room-' + socket.roomnum]['winners'].includes(data.userName)) {
            masterRoomData['room-' + socket.roomnum]['winners'].push(data.userName);
            io.sockets.in('room-' + socket.roomnum).emit('winners', masterRoomData['room-' + socket.roomnum]['winners']);
        }
    });
    function nextRound(roomnum) {
        let words = wordList.words;
        const randomWord = words[Math.floor(Math.random() * words.length)];
        let users = userrooms[roomnum];
        let currIndex = masterRoomData['room-' + socket.roomnum]['userIndex'];
        nextIndex = (currIndex + 1) % masterRoomData['room-' + socket.roomnum]['users'].length
        masterRoomData['room-' + socket.roomnum]['userIndex'] = nextIndex;
        masterRoomData['room-' + socket.roomnum]['currentDrawer'] = users[nextIndex];
        masterRoomData['room-' + socket.roomnum]['winners'] = [];
        let obj = { 'socketId': users[nextIndex], 'word': randomWord };
        // console.log(masterRoomData);
        // console.log(obj);
        io.sockets.in('room-' + socket.roomnum).emit('currentDrawer', obj);
        startTimer(socket.roomnum);
    }
});
