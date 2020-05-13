package com.mindhub.salvo;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toSet;


@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    private Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    private Set<Score> scores;

    private LocalDateTime creationDate;

    public Game() { creationDate = LocalDateTime.now(); }

    public Game(int hours) {
        creationDate = LocalDateTime.now().plusHours(hours);
    }

    public Map<String, Object> makeGameDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("created", this.creationDate);
        dto.put("gamePlayers", this.gamePlayers.stream().map(gamePlayer -> gamePlayer.makeGamePlayerDTO()).collect(Collectors.toList()));
        return dto;
    }

    @JsonIgnore
    public Set<Player> getPlayers() { return gamePlayers.stream().map(sub -> sub.getPlayer()).collect(toSet()); }

    public LocalDateTime getCreationDate() { return creationDate; }

    public Set<GamePlayer> getGamePlayers() { return gamePlayers; }

    public long getId() { return id; }
}