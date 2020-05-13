package com.mindhub.salvo;


import org.hibernate.annotations.GenericGenerator;
import org.springframework.http.ResponseEntity;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Entity
public class GamePlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player;

    @OneToMany(mappedBy="gamePlayer", cascade = CascadeType.ALL, fetch=FetchType.EAGER)
    private Set<Ship> ships = new HashSet<>();

    @OneToMany(mappedBy="gamePlayer", cascade = CascadeType.ALL, fetch=FetchType.EAGER)
    private Set<Salvo> salvoes = new HashSet<>();

    private LocalDateTime joinDate;

    private boolean isCreator;

    public GamePlayer() { }

    public GamePlayer(Game game, Player player, boolean isCreator) {
        joinDate = LocalDateTime.now();
        this.game = game;
        this.player = player;
        this.isCreator = isCreator;
    }

    public void addShip(Ship ship) {
        ship.setGamePlayer(this);
        this.ships.add(ship);
    }

    public void addSalvo(Salvo salvo) {
        salvo.setGamePlayer(this);
        this.salvoes.add(salvo);
    }

    public Map<String, Object> makeGamePlayerDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("player", this.player.makePlayerDTO());
        if(this.getScore(this.game)!= null)
            dto.put("score", this.getScore(this.game).makeScoresDTO());
        else
            dto.put("score", null);
        return dto;
    }

    public Map<String, Object> makeGameViewDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.game.getId());
        dto.put("created", this.game.getCreationDate());
        dto.put("state", getState());
        dto.put("gamePlayers", this.game.getGamePlayers().stream().map(gamePlayer -> gamePlayer.makeGamePlayerDTO()).collect(Collectors.toList()));
        dto.put("ships", this.getShips().stream().map(ship -> ship.makeShipsDTO()).collect(Collectors.toList()));
        dto.put("salvoes", this.game.getGamePlayers().stream()
                        .flatMap(gamePlayer -> gamePlayer.getSalvoes().stream().map(salvo -> salvo.makeSalvoesDTO())).collect(Collectors.toList()));
        return dto;
    }

    public GameState getState(){
        if (this.getShips().size() < 5) {
                return GameState.PLACE_SHIPS;
        }

        if (this.getOpponent() !=null) {
            int playerOneSunkedShips = this.getShips().stream().filter(ship -> ship.isSunked(this.getOpponent().getSalvoes().stream())).collect(Collectors.toList()).size();

            int playerOneTurn = this.getLastTurn();

            int playerTwoTurn = this.getOpponent().getLastTurn();

            int playerTwoSunkedShips = this.getOpponent().getShips().stream().filter(ship -> ship.isSunked(this.salvoes.stream())).collect(Collectors.toList()).size();

            if (this.getOpponent().getShips().size() < 5) {
                return GameState.WAIT_SHIPS_OPPONENT;
            }

            if (playerTwoSunkedShips == 5 && playerOneSunkedShips < 5 && playerOneTurn == playerTwoTurn) {
                    return GameState.GAME_OVER_WIN;

            } else if (playerTwoSunkedShips < 5 && playerOneSunkedShips == 5 && playerOneTurn == playerTwoTurn) {
                    return GameState.GAME_OVER_LOST;

            } else if (playerTwoSunkedShips == 5 && playerOneSunkedShips == 5 && playerOneTurn == playerTwoTurn) {
                    return GameState.GAME_OVER_TIE;

            } else {
                if (this.isCreator()) {
                    if (this.getSalvoes().size() == 0 || playerOneTurn - playerTwoTurn == 0) {
                        return GameState.PLACE_SALVOES;
                    } else {
                        return GameState.WAIT_SALVOES_OPPONENT;
                    }
                } else {
                    if (playerOneTurn - playerTwoTurn == -1) {
                        return GameState.PLACE_SALVOES;
                    } else {
                        return GameState.WAIT_SALVOES_OPPONENT;
                    }
                }
            }
        }

        if (this.getSalvoes().size() == 0) {
            return GameState.PLACE_SALVOES;
        }

        return GameState.WAIT_JOIN_OPPONENT;
    }

    public GamePlayer getOpponent() {

        GamePlayer opponentGamePlayer = this.getGame().getGamePlayers().stream().filter(gamePlayer -> gamePlayer.getId() != this.id).findFirst().orElse(null);

        return opponentGamePlayer;
    }

    public boolean isCreator() { return isCreator; }

    public int getLastTurn() {
        return this.getSalvoes().size();
    }

    public long getId() { return id; }

    public Game getGame() { return game; }

    public Player getPlayer() { return player; }

    public Set<Ship> getShips() { return ships; }

    public Set<Salvo> getSalvoes() { return salvoes; }

    public Score getScore(Game game) { return this.player.getScore(game); }

    public LocalDateTime getJoinDate() { return joinDate; }
}