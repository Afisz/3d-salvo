'use strict';


var app = new Vue({
    el: '#app',
    data: {
        gamePlayerURL: "",
        gameView: {
            ships: []
        },
        gamePlayerId: '',
        player: {},
        opponent: null,
        timerId: null,
        errorMessage:'',
        ships: {
            patrol: {
                type: 'patrol',
                actualCenter: {x: 0, z: 0},
                actualPosition: {x: 0, z: 0},
                realPosition: {x: 5, z: 1}
                },
            submarine: {
                type: 'submarine',
                actualCenter: {x: 0, z: 0},
                actualPosition: {x: 0, z: 0},
                realPosition: {x: 4, z: 3}
            },
            destroyer: {
                type: 'destroyer',
                actualCenter: {x: 0, z: 0},
                actualPosition: {x: 0, z: 0},
                realPosition: {x: 4, z: 5}
            },
            battleship: {
                type: 'battleship',
                actualCenter: {x: 0, z: 0},
                actualPosition: {x: 0, z: 0},
                realPosition: {x: 3, z: 7}
            },
            carrier: {
                type: 'carrier',
                actualCenter: {x: 0, z: 0},
                actualPosition: {x: 0, z: 0},
                realPosition: {x: 2, z: 9}
            },
            shipsData: [
                {'type': 'patrol', 'locations': ['51', '61']},
                {'type': 'submarine', 'locations': ['43', '53', '63']},
                {'type': 'destroyer', 'locations': ['45', '55', '65']},
                {'type': 'battleship', 'locations': ['37', '47', '57', '67']},
                {'type': 'carrier', 'locations': ['29', '39', '49', '59', '69']}
            ]
        },
        salvoesSelected:[],
        sunkedShipsPlayer: [],
        sunkedShipsOpponent: [],
        salvoesButtonMessage: '',
        instructions: 'on'
    },
    methods: {
        signOut: function(){
            $.post('/api/logout', function(){
                window.location.href = '/web/games.html';
                console.log('logged out');
            });
        },
        placeShips: function() {
                let url = '/api/games/players/' + app.gamePlayerId + '/ships';

                $.post({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(app.ships.shipsData),
                    success: function () {

                        window.location.reload();
                    },
                    contentType: 'application/json'
                }).fail(function (response) {
                    app.errorMessage = response.responseJSON.error;
                    $('#modal').modal();
                });
        },
        salvoesShoot: function(){
            let url = '/api/games/players/' + app.gamePlayerId + '/salvos';

            let data = {
                'turn': '',
                'locations': app.salvoesSelected
            };

            if(app.salvoesSelected.length == 5 - app.sunkedShipsPlayer.length){
                $.post({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(data),
                    success: function () {
                        $.get(app.gamePlayerURL, function (gameView) {
                            app.gameView = gameView;

                            app.gameView.gamePlayers.forEach(app.playersGetInfo);

                            if (app.gameView.salvoes.length > 0 && app.opponent != null) {
                                loadSunkedBoats();

                                salvoesMarks1();

                                salvoesMarks2();

                                if (app.gameView.state == 'WAIT_SALVOES_OPPONENT') {
                                    app.salvoesButtonMessage = 'WAITING OPPONENT';

                                    let actionButton = document.getElementById('action-button');

                                    actionButton.setAttribute('disabled', 'true');
                                }  else if (app.gameView.state == 'PLACE_SALVOES') {
                                    app.salvoesButtonMessage = 'PLACE ' + (5 - app.sunkedShipsPlayer.length).toString() + ' SALVOES';

                                    let actionButton = document.getElementById('action-button');

                                    actionButton.removeAttribute('disabled');
                                }
                            } else if (app.gameView.salvoes.length > 0 && app.opponent == null) {
                                app.salvoesButtonMessage = 'WAITING AN OPPONENT';

                                let actionButton = document.getElementById('action-button');

                                actionButton.setAttribute('disabled', 'true');
                            }
                        });
                        app.salvoesSelected = [];
                    },
                    contentType: 'application/json'
                }).fail(function (response) {
                    app.errorMessage = response.responseJSON.error;
                    $('#modal').modal();
                });
            } else {
                app.errorMessage = 'You must place ' + (5 - app.sunkedShipsPlayer.length).toString() + ' salvoes on the grid';
                $('#modal').modal();
            }
        },
        playersGetInfo: function(gamePlayer){
            if(gamePlayer.id == app.gamePlayerId){
                app.player = gamePlayer.player;
            }else{
                app.opponent = gamePlayer.player;
            }
        },
        getSunkedShips: function(){
            let opponentSalvoes = app.gameView.salvoes.filter(salvo => salvo.player.id != app.player.id).sort((a, b) => a.turn - b.turn);

            let playerSalvoes = app.gameView.salvoes.filter(salvo => salvo.player.id == app.player.id).sort((a, b) => a.turn - b.turn);

            if (opponentSalvoes[opponentSalvoes.length - 1]) {
                if (playerSalvoes[playerSalvoes.length - 1]) {
                    if (playerSalvoes[playerSalvoes.length - 1].turn == opponentSalvoes[opponentSalvoes.length - 1].turn) {
                        app.sunkedShipsPlayer = opponentSalvoes[opponentSalvoes.length - 1].sunkedShips;
                    } else {
                        app.sunkedShipsPlayer = opponentSalvoes[opponentSalvoes.length - 2].sunkedShips;
                    }
                } else {
                    app.sunkedShipsPlayer = [];
                }
            }

            if (playerSalvoes[playerSalvoes.length - 1]) {
                app.sunkedShipsOpponent = playerSalvoes[playerSalvoes.length - 1].sunkedShips;
            }
        },
        closeInstructions: function() {
            app.instructions = 'off';
        }
    }
});


//Get game player
const urlParams = new URLSearchParams(window.location.search);

app.gamePlayerId = urlParams.get('gp');

app.gamePlayerURL = '/api/game_view/' + app.gamePlayerId;


//Get game view JSON
$.get(app.gamePlayerURL, function (gameView) {
    app.gameView = gameView;

    app.gameView.gamePlayers.forEach(app.playersGetInfo);

    if(app.gameView.ships.length > 0){
        if (app.gameView.state == 'WAIT_SALVOES_OPPONENT' || app.gameView.state == 'WAIT_SHIPS_OPPONENT') {
            app.salvoesButtonMessage = 'WAITING OPPONENT';

            let actionButton = document.getElementById('action-button');

            actionButton.setAttribute('disabled', 'true');
        } else if (app.gameView.state == 'WAIT_JOIN_OPPONENT') {
            app.salvoesButtonMessage = 'WAITING AN OPPONENT';

            let actionButton = document.getElementById('action-button');

            actionButton.setAttribute('disabled', 'true');
        } else if (app.gameView.state == 'PLACE_SALVOES') {
            app.salvoesButtonMessage = 'PLACE ' + (5 - app.sunkedShipsPlayer.length).toString() + ' SALVOES';

            let actionButton = document.getElementById('action-button');

            actionButton.removeAttribute('disabled');
        }

        app.getSunkedShips();

        init2();

        animate2();

        init3();

        animate3();

        if(app.opponent != null){
            salvoesMarks1();

            salvoesMarks2();
        }

    }else {
        document.getElementById('opponent-ships').style.display = 'none';

        init();

        animate();
    }

    setTimeout(function(){app.timerId = setInterval(function(){$.get(app.gamePlayerURL, function (gameView) {
        app.gameView = gameView;

        app.gameView.gamePlayers.forEach(app.playersGetInfo);

        if(app.gameView.salvoes.length > 0){
            if (app.gameView.state == 'WAIT_SALVOES_OPPONENT' || app.gameView.state == 'WAIT_SHIPS_OPPONENT') {
                app.salvoesButtonMessage = 'WAITING OPPONENT';

                let actionButton = document.getElementById('action-button');

                actionButton.setAttribute('disabled', 'true');
            } else if (app.gameView.state == 'WAIT_JOIN_OPPONENT') {
                app.salvoesButtonMessage = 'WAITING AN OPPONENT';

                let actionButton = document.getElementById('action-button');

                actionButton.setAttribute('disabled', 'true');
            } else if (app.gameView.state == 'PLACE_SALVOES') {
                app.salvoesButtonMessage = 'PLACE ' + (5 - app.sunkedShipsPlayer.length).toString() + ' SALVOES';

                let actionButton = document.getElementById('action-button');

                actionButton.removeAttribute('disabled');
            }

            app.getSunkedShips();

            if(app.opponent != null){
                salvoesMarks1();

                salvoesMarks2();
            }
        }

    }).fail()}, 10000);},10000);

}).fail();
