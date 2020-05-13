'use strict';


var app = new Vue({
    el: '#app',
    data: {
        games: [],
        players:[],
        player: '',
        userEmail: '',
        userPassword: '',
        signInRegisterButton: '',
        errorMessage: ''
    },
    methods: {
        registerButton: function() {
            app.signInRegisterButton = 'Register';
            $('#modal-signin-register').modal();
        },
        signInButton: function() {
            app.signInRegisterButton = 'Sign In';
            $('#modal-signin-register').modal();
        },
        signInRegister: function(){
            if (app.signInRegisterButton == 'Register') {
                if (app.userEmail == '' && app.userPassword == ''){
                    app.errorMessage = 'No e-mail nor password given';
                    let inputMail = document.getElementById('input-mail');
                    inputMail.classList.add('is-invalid');
                    let inputPass = document.getElementById('input-pass');
                    inputPass.classList.add('is-invalid');
                }else if (app.userEmail == ''){
                    let inputPass = document.getElementById('input-pass');
                    inputPass.classList.remove('is-invalid');
                    app.errorMessage = 'No e-mail given';
                    let inputMail = document.getElementById('input-mail');
                    inputMail.classList.add('is-invalid');
                }else if (app.userPassword == ''){
                    let inputMail = document.getElementById('input-mail');
                    inputMail.classList.remove('is-invalid');
                    app.errorMessage = 'No password given';
                    let inputPass = document.getElementById('input-pass');
                    inputPass.classList.add('is-invalid');
                }else if (!checkPassword(app.userPassword)){
                    let inputMail = document.getElementById('input-mail');
                    inputMail.classList.remove('is-invalid');
                    app.errorMessage = 'Password must have at least: 8 characters long, one number, one lowercase and one uppercase letter';
                    let inputPass = document.getElementById('input-pass');
                    inputPass.classList.add('is-invalid');
                }else {
                    $.post('/api/players', {name: app.userEmail, pwd: app.userPassword}, function (response) {
                        $.post('/api/login', {name: app.userEmail, pwd: app.userPassword}, function () {
                            window.location.reload();
                        })
                    })
                }
            } else if (app.signInRegisterButton == 'Sign In') {
                if (app.userEmail == '' && app.userPassword == ''){
                    app.errorMessage = 'No e-mail nor password given';
                    let inputMail = document.getElementById('input-mail');
                    inputMail.classList.add('is-invalid');
                    let inputPass = document.getElementById('input-pass');
                    inputPass.classList.add('is-invalid');
                }else if (app.userEmail == ''){
                    let inputPass = document.getElementById('input-pass');
                    inputPass.classList.remove('is-invalid');
                    app.errorMessage = 'No e-mail given';
                    let inputMail = document.getElementById('input-mail');
                    inputMail.classList.add('is-invalid');
                }else if (app.userPassword == '') {
                    let inputMail = document.getElementById('input-mail');
                    inputMail.classList.remove('is-invalid');
                    app.errorMessage = 'No password given';
                    let inputPass = document.getElementById('input-pass');
                    inputPass.classList.add('is-invalid');
                }else {
                    $.post('/api/login', { name: app.userEmail, pwd: app.userPassword }, function(){
                        window.location.reload();
                    }).fail(function(){
                        app.errorMessage = 'Invalid e-mail or password, please try again.';
                        let inputMail = document.getElementById('input-mail');
                        inputMail.classList.add('is-invalid');
                        let inputPass = document.getElementById('input-pass');
                        inputPass.classList.add('is-invalid');
                    })
                }
            }
        },
        signOut: function(){
            $.post('/api/logout', function(){
                window.location.href = '/web/games.html';
            });
        },
        returnGame: function(gamePlayerId){
            let url = '/web/game.html?gp=' + gamePlayerId;
            window.location.href = url;
        },
        joinGame: function(gameId){
            let url = '/api/game/' + gameId + '/players';
            $.post(url, function(response){
                    let url = '/web/game.html?gp=' + response.success.gpId;
                    window.location.href = url;
                }
                ).fail(function(response){
                app.errorMessage = response.error;
                $('#modal-error').modal();
            })
        },
        createGame: function(){
            $.post('/api/games', function(response){
                let url = '/web/game.html?gp=' + response.success.gpId;
                window.location.href = url;
            }
            ).fail(function(response){
                app.errorMessage = response.error;
                $('#modal-error').modal();
            });
        }
},
    filters: {
        dateFormat: function (date) {
            if (!date) return '';
            return moment(date).format('MMMM Do YYYY');
        }
    }
});


//On load
$.get('/api/games').done(function (games) {
    app.games = games.games;
    if(games.player) {
        app.player = games.player
    };
    listOfPlayers();
}).fail();


//Return list of players
function listOfPlayers(){
    let a = app.games.flatMap(game => game.gamePlayers.flatMap(gamePlayers => gamePlayers.player)).map(player => player.name);

    let b = a.filter(unique);

    let c = b.map(x => {return {'userName': x, 'total': totalPlayer(x), 'won': wonPlayer(x), 'tied': tiedPlayer(x), 'lost': lostPlayer(x)}});

    c.sort(function (a, b) {
        if (a.total < b.total) {
            return 1;
        }
        if (a.total > b.total) {
            return -1;
        }
        return 0;
    });

    app.players = c;
}

//Get total per player
function totalPlayer(userName){
    let a = app.games.flatMap(game => game.gamePlayers).filter(gamePlayer => gamePlayer.player.name == userName);

    let b = 0;

    for(let i = 0; i < a.length; i++){
        if (a[i].score !== null){
            b += a[i].score.score
        }
    }
    return b;
}

//Get won per player
function wonPlayer(userName){
    let a = app.games.flatMap(game => game.gamePlayers).filter(gamePlayer => gamePlayer.player.name == userName);

    let b = 0;

    for(let i = 0; i < a.length; i++){
        if (a[i].score !== null && a[i].score.score == 1){
            b++;
        }
    }
    return b;
}

//Get tied per player
function tiedPlayer(userName){
    let a = app.games.flatMap(game => game.gamePlayers).filter(gamePlayer => gamePlayer.player.name == userName);

    let b = 0;

    for(let i = 0; i < a.length; i++){
        if (a[i].score !== null && a[i].score.score == 0.5){
            b++;
        }
    }
    return b;
}

//Get lost per player
function lostPlayer(userName){
    let a = app.games.flatMap(game => game.gamePlayers).filter(gamePlayer => gamePlayer.player.name == userName);

    let b = 0;

    for(let i = 0; i < a.length; i++){
        if (a[i].score !== null && a[i].score.score == 0){
            b++;
        }
    }
    return b;
}

//Get unique values
function unique(value, index, self){
    return self.indexOf(value) === index
}

//Check password
function checkPassword(pwd) {
    // at least one number, one lowercase and one uppercase letter
    // at least eight characters
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return re.test(pwd);
}
