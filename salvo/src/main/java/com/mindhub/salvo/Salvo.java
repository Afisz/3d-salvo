package com.mindhub.salvo;


import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;


@Entity
public class Salvo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;

    @ElementCollection
    @Column(name="locations")
    private List<String> locations = new ArrayList<String>();

    private Integer turn;

    public Salvo() { }

    public Salvo(Integer turn, GamePlayer gamePlayer, List<String> locations) {
        this.turn = turn;
        this.gamePlayer = gamePlayer;
        this.locations = locations;
    }

    public Map<String, Object> makeSalvoesDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn", this.turn);
        dto.put("player", this.gamePlayer.getPlayer().makePlayerDTO());
        if (this.gamePlayer.getOpponent() != null && this.gamePlayer.getShips().size() != 0 && this.gamePlayer.getOpponent().getShips().size() != 0) {
            dto.put("locations", this.locations);
            dto.put("hits", getHits());
            dto.put("sunkedShips", sunkedShipsTillTurn(this.turn));
        }
        return dto;
    }

    public Stream sunkedShipsTillTurn(int turn) {
        return this.gamePlayer.getOpponent().getShips().stream().filter(ship -> ship.isSunked(getSalvoesTillTurn(turn))).map(ship -> ship.makeShipsDTO());
    }

    public Stream<Salvo> getSalvoesTillTurn(int turn) {
        return this.gamePlayer.getSalvoes()
                .stream()
                .filter(salvo -> salvo.getTurn() <= turn);
    }

    public Stream<String> getHits() {
            return this.gamePlayer.getOpponent().getShips().stream().flatMap(ship -> ship.getLocations().stream().filter(location -> this.locations.contains(location)));
    }

    public long getId() { return id; }

    public Integer getTurn() { return turn; }

    public List<String> getLocations() { return locations; }

    public GamePlayer getGamePlayer() { return gamePlayer; }

    public void setTurn(Integer turn) { this.turn = turn; }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }
}