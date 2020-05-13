package com.mindhub.salvo;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import static java.util.stream.Collectors.toSet;


@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    private Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    private Set<Score> scores;

    private String userName;

    private String password;

    public Player() { }

    public Player(String userName, String password) {

        this.userName = userName;
        this.password = password;
    }

    public Map<String, Object> makePlayerDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("name", this.userName);
        return dto;
    }

    public long getId() {
        return id;
    }

    public String getUserName() { return userName; }

    @JsonIgnore
    public String getPassword() { return password; }

    public Set<Game> getGames() {
        return gamePlayers.stream().map(sub -> sub.getGame()).collect(toSet());
    }

    public Set<Score> getScores() { return scores; }

    public Score getScore(Game game) {
        return this.scores.stream().filter(score -> score.getGame().getId() == game.getId()).findFirst().orElse(null); }

    public Set<GamePlayer> getGamePlayers() { return gamePlayers; }

    public void setPassword(String password) { this.password = password; }
}