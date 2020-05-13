package com.mindhub.salvo;


import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.*;


@Entity
public class Score {

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

    private LocalDateTime finishDate;

    private double score;

    public Score() { }

    public Score(double score, Game game, Player player) {
        finishDate = LocalDateTime.now();
        this.score = score;
        this.game = game;
        this.player = player;
    }

    public Map<String, Object> makeScoresDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("score", this.score);
        return dto;
    }

    public long getId() {
        return id;
    }

    public Game getGame() {
        return game;
    }

    public Player getPlayer() {
        return player;
    }

    public double getScore() { return score; }

    public LocalDateTime getFinishDate() {
        return finishDate;
    }
}