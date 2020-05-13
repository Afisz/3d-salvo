package com.mindhub.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping(path = "/players")
    public ResponseEntity<Map<String, Object>> createUser(String name, String pwd) {
        if (name.isEmpty() || pwd.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "No username or password given"), HttpStatus.FORBIDDEN);
        }

        Player player = playerRepository.findByUserName(name);
        if (player != null) {
            return new ResponseEntity<>(makeMap("error", "Username already exists"), HttpStatus.CONFLICT);
        }

        playerRepository.save(new Player(name, passwordEncoder.encode(pwd)));

        player = playerRepository.findByUserName(name);

        return new ResponseEntity<>(makeMap("player ID", player.getId()), HttpStatus.CREATED);
    }

    @PostMapping(path = "/games")
    public ResponseEntity<Map<String, Object>> createGame(Authentication authentication) {
        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap("error", "You must log in"), HttpStatus.UNAUTHORIZED);
        }

        Player player = playerRepository.findByUserName(authentication.getName());

        Game newGame = gameRepository.save(new Game());

        GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(newGame, player, true));

        return new ResponseEntity<>(makeMap("success", makeMap("gpId", newGamePlayer.getId())), HttpStatus.CREATED);
    }

    @PostMapping(path = "/game/{gameId}/players")
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable long gameId, Authentication authentication) {
        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap("error", "You must log in"), HttpStatus.UNAUTHORIZED);
        }

        Optional<Game> game = gameRepository.findById(gameId);

        if (!game.isPresent()) {
            return new ResponseEntity<>(makeMap("error", "No such game"), HttpStatus.FORBIDDEN);
        }

        if (game.get().getPlayers().size() > 1) {
            return new ResponseEntity<>(makeMap("error", "Game is full"), HttpStatus.FORBIDDEN);
        }

        Player player = playerRepository.findByUserName(authentication.getName());

        GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(game.get(), player, false));

        return new ResponseEntity<>(makeMap("success", makeMap("gpId", newGamePlayer.getId())), HttpStatus.CREATED);
    }

    @PostMapping(value = "/games/players/{gamePlayerId}/ships")
    public ResponseEntity<Map<String, Object>> shipsLocations(@PathVariable long gamePlayerId, Authentication authentication, @RequestBody List<Ship> ships) {
        Optional<GamePlayer> gamePlayer = gamePlayerRepository.findById(gamePlayerId);

        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap("error", "You must log in"), HttpStatus.UNAUTHORIZED);
        } else if (gamePlayer.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "The GamePlayer doesn't exists"), HttpStatus.UNAUTHORIZED);
        }

        Player player = playerRepository.findByUserName(authentication.getName());

        if (gamePlayer.get().getPlayer().getUserName() != player.getUserName()) {
            return new ResponseEntity<>(makeMap("error", "The GamePlayer doesn't match the Player"), HttpStatus.UNAUTHORIZED);
        } else if (gamePlayer.get().getShips().size() > 0) {
            return new ResponseEntity<>(makeMap("error", "Ships already placed"), HttpStatus.FORBIDDEN);
        }

        ships.forEach(ship -> gamePlayer.get().addShip(ship));

        gamePlayerRepository.save(gamePlayer.get());

        return new ResponseEntity<>(makeMap("success", "Ships placed"), HttpStatus.CREATED);
    }

    @PostMapping(value = "/games/players/{gamePlayerId}/salvos")
    public ResponseEntity<Map<String, Object>> salvoesLocations(@PathVariable long gamePlayerId, Authentication authentication, @RequestBody Salvo preSalvo) {
        Optional<GamePlayer> gamePlayer = gamePlayerRepository.findById(gamePlayerId);

        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap("error", "You must log in"), HttpStatus.UNAUTHORIZED);
        }
        if (gamePlayer.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "The GamePlayer doesn't exists"), HttpStatus.UNAUTHORIZED);
        }
        Player player = playerRepository.findByUserName(authentication.getName());

        if (gamePlayer.get().getPlayer().getUserName() != player.getUserName()) {
            return new ResponseEntity<>(makeMap("error", "The GamePlayer doesn't match the Player"), HttpStatus.UNAUTHORIZED);
        }

        if (gamePlayer.get().getOpponent() != null) {
            if (gamePlayer.get().isCreator()) {
                if (gamePlayer.get().getSalvoes().size() == 0) {
                    preSalvo.setTurn(gamePlayer.get().getSalvoes().size() + 1);

                    gamePlayer.get().addSalvo(preSalvo);

                    gamePlayerRepository.save(gamePlayer.get());

                    return new ResponseEntity<>(makeMap("success", "Salvoes shooted"), HttpStatus.CREATED);
                }

                if (gamePlayer.get().getSalvoes().size() - gamePlayer.get().getOpponent().getSalvoes().size() != 0) {
                    return new ResponseEntity<>(makeMap("error", "You must wait your turn"), HttpStatus.FORBIDDEN);
                } else if (preSalvo.getLocations().size() != (5 - gamePlayer.get().getOpponent().getSalvoes().stream().findAny().get().sunkedShipsTillTurn(gamePlayer.get().getOpponent().getSalvoes().size()).count())) {
                        return new ResponseEntity<>(makeMap("error", "You can shoot as much salvoes as ships you have left"), HttpStatus.FORBIDDEN);
                }
            } else {
                if (gamePlayer.get().getSalvoes().size() - gamePlayer.get().getOpponent().getSalvoes().size() != -1) {
                    return new ResponseEntity<>(makeMap("error", "You must wait your turn"), HttpStatus.FORBIDDEN);
                } else if (preSalvo.getLocations().size() != (5 - gamePlayer.get().getOpponent().getSalvoes().stream().findAny().get().sunkedShipsTillTurn(gamePlayer.get().getOpponent().getSalvoes().size() - 1).count())) {
                        return new ResponseEntity<>(makeMap("error", "You can shoot as much salvoes as ships you have left"), HttpStatus.FORBIDDEN);
                }
            }
            preSalvo.setTurn(gamePlayer.get().getSalvoes().size() + 1);

            gamePlayer.get().addSalvo(preSalvo);

            gamePlayerRepository.save(gamePlayer.get());

            if (gamePlayer.get().getState() == GameState.GAME_OVER_WIN) {
                scoreRepository.save(new Score(1, gamePlayer.get().getGame(), gamePlayer.get().getPlayer()));

                scoreRepository.save(new Score(0, gamePlayer.get().getGame(), gamePlayer.get().getOpponent().getPlayer()));

                return new ResponseEntity<>(makeMap("success", "Game over, you win!"), HttpStatus.CREATED);

            } else if (gamePlayer.get().getState() == GameState.GAME_OVER_LOST) {
                scoreRepository.save(new Score(0, gamePlayer.get().getGame(), gamePlayer.get().getPlayer()));

                scoreRepository.save(new Score(1, gamePlayer.get().getGame(), gamePlayer.get().getOpponent().getPlayer()));

                return new ResponseEntity<>(makeMap("success", "Game Over, you lost!"), HttpStatus.CREATED);

            } else if (gamePlayer.get().getState() == GameState.GAME_OVER_TIE) {
                scoreRepository.save(new Score(0.5, gamePlayer.get().getGame(), gamePlayer.get().getPlayer()));

                scoreRepository.save(new Score(0.5, gamePlayer.get().getGame(), gamePlayer.get().getOpponent().getPlayer()));

                return new ResponseEntity<>(makeMap("success", "Game Over, it's a tie!"), HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(makeMap("success", "Salvoes shooted"), HttpStatus.CREATED);
            }
        }

        if (gamePlayer.get().getSalvoes().size() == 0) {
            preSalvo.setTurn(gamePlayer.get().getSalvoes().size() + 1);

            gamePlayer.get().addSalvo(preSalvo);

            gamePlayerRepository.save(gamePlayer.get());

            return new ResponseEntity<>(makeMap("success", "Salvoes shooted"), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(makeMap("error", "You must wait for a second player to join and play"), HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/games")
    public Map<String, Object> getGames(Authentication authentication) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        if(isGuest(authentication)) {
            dto.put("player", null);
        }else{
            dto.put("player", playerRepository.findByUserName(authentication.getName()).makePlayerDTO());
        }

        dto.put("games", gameRepository
                .findAll()
                .stream()
                .map(Game::makeGameDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    @GetMapping("/game_view/{gamePlayerId}")
    public ResponseEntity<Map<String, Object>> getGameView(@PathVariable long gamePlayerId, Authentication authentication) {
        String authenticatedUserName = authentication.getName();

        Optional<GamePlayer> gamePlayer = gamePlayerRepository.findById(gamePlayerId);

        if (!gamePlayer.isPresent()) {
            return new ResponseEntity<>(makeMap("error", "The GamePlayer doesn't exists"), HttpStatus.FORBIDDEN);
        }

        if (gamePlayer.get().getPlayer().getUserName() != authenticatedUserName) {
            return new ResponseEntity<>(makeMap("error", "You are not allowed to see this content"), HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(gamePlayer.get().makeGameViewDTO(), HttpStatus.OK);
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();

        map.put(key, value);

        return map;
    }

    private boolean isGuest(Authentication authentication) {

        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }
}