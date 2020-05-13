package com.mindhub.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.Arrays;


@SpringBootApplication
public class SalvoApplication {

	@Autowired
	PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository,
									  ShipRepository shipRepository, SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
		return (args) -> {

			Player player1 = playerRepository.save(new Player("j.bauer@ctu.gov", passwordEncoder.encode("24")));
			Player player2 = playerRepository.save(new Player("c.obrian@ctu.gov", passwordEncoder.encode("42")));
			Player player3 = playerRepository.save(new Player("kim_bauer@gmail.com", passwordEncoder.encode("kb")));
			Player player4 = playerRepository.save(new Player("t.almeida@ctu.gov", passwordEncoder.encode("mole")));

			Game game1 = gameRepository.save(new Game(0));
			Game game2 = gameRepository.save(new Game(1));
			Game game3 = gameRepository.save(new Game(2));
			Game game4 = gameRepository.save(new Game(3));
			Game game5 = gameRepository.save(new Game(4));
			Game game6 = gameRepository.save(new Game(5));
			Game game7 = gameRepository.save(new Game(6));
			Game game8 = gameRepository.save(new Game(7));

			GamePlayer gamePlayer1 = gamePlayerRepository.save(new GamePlayer(game1, player1, true));
			GamePlayer gamePlayer2 = gamePlayerRepository.save(new GamePlayer(game1, player2, false));
			GamePlayer gamePlayer3 = gamePlayerRepository.save(new GamePlayer(game2, player1, true));
			GamePlayer gamePlayer4 = gamePlayerRepository.save(new GamePlayer(game2, player2, false));
			GamePlayer gamePlayer5 = gamePlayerRepository.save(new GamePlayer(game3, player2, true));
			GamePlayer gamePlayer6 = gamePlayerRepository.save(new GamePlayer(game3, player4, false));
			GamePlayer gamePlayer7 = gamePlayerRepository.save(new GamePlayer(game4, player2,true));
			GamePlayer gamePlayer8 = gamePlayerRepository.save(new GamePlayer(game4, player1, false));
			GamePlayer gamePlayer9 = gamePlayerRepository.save(new GamePlayer(game5, player4, true));
			GamePlayer gamePlayer10 = gamePlayerRepository.save(new GamePlayer(game5, player1, false));
			GamePlayer gamePlayer11 = gamePlayerRepository.save(new GamePlayer(game6, player1, true));
			GamePlayer gamePlayer12 = gamePlayerRepository.save(new GamePlayer(game7, player4, true));
			GamePlayer gamePlayer13 = gamePlayerRepository.save(new GamePlayer(game8, player1, true));
			GamePlayer gamePlayer14 = gamePlayerRepository.save(new GamePlayer(game8, player4, false));

			Ship ship1 = shipRepository.save(new Ship("destroyer", gamePlayer1, Arrays.asList("04", "14", "24")));
			Ship ship2 = shipRepository.save(new Ship("submarine", gamePlayer1, Arrays.asList("02", "12", "22")));
			Ship ship3 = shipRepository.save(new Ship("patrol", gamePlayer1, Arrays.asList("80", "90")));
			Ship ship4 = shipRepository.save(new Ship("destroyer", gamePlayer2, Arrays.asList("25", "35", "45")));
			Ship ship5 = shipRepository.save(new Ship("patrol", gamePlayer2, Arrays.asList("61", "62")));
			Ship ship6 = shipRepository.save(new Ship("destroyer", gamePlayer3, Arrays.asList("25", "35", "45")));
			Ship ship7 = shipRepository.save(new Ship("patrol", gamePlayer3, Arrays.asList("36", "37")));
			Ship ship8 = shipRepository.save(new Ship("submarine", gamePlayer4, Arrays.asList("12", "13", "14")));
			Ship ship9 = shipRepository.save(new Ship("patrol", gamePlayer4, Arrays.asList("76", "86")));
			Ship ship10 = shipRepository.save(new Ship("destroyer", gamePlayer5, Arrays.asList("25", "35", "45")));
			Ship ship11 = shipRepository.save(new Ship("patrol", gamePlayer5, Arrays.asList("36", "37")));
			Ship ship12 = shipRepository.save(new Ship("submarine", gamePlayer6, Arrays.asList("12", "13", "14")));
			Ship ship13 = shipRepository.save(new Ship("patrol", gamePlayer6, Arrays.asList("76", "86")));
			Ship ship14 = shipRepository.save(new Ship("battleship", gamePlayer1, Arrays.asList("73", "74", "75", "76")));
			Ship ship15 = shipRepository.save(new Ship("carrier", gamePlayer1, Arrays.asList("92", "93", "94", "95", "96")));

			Salvo salvo1 = salvoRepository.save(new Salvo(1, gamePlayer1, Arrays.asList("25", "35", "61")));
			Salvo salvo2 = salvoRepository.save(new Salvo(1, gamePlayer2, Arrays.asList("24", "25", "26")));
			Salvo salvo3 = salvoRepository.save(new Salvo(2, gamePlayer1, Arrays.asList("62", "45")));
			Salvo salvo4 = salvoRepository.save(new Salvo(2, gamePlayer2, Arrays.asList("51", "83", "12")));
			Salvo salvo5 = salvoRepository.save(new Salvo(1, gamePlayer3, Arrays.asList("12", "14", "76")));
			Salvo salvo6 = salvoRepository.save(new Salvo(1, gamePlayer4, Arrays.asList("25", "25", "37")));
			Salvo salvo7 = salvoRepository.save(new Salvo(2, gamePlayer3, Arrays.asList("13", "86")));
			Salvo salvo8 = salvoRepository.save(new Salvo(2, gamePlayer4, Arrays.asList("35", "36")));
			Salvo salvo9 = salvoRepository.save(new Salvo(1, gamePlayer5, Arrays.asList("76", "86", "14")));
			Salvo salvo10 = salvoRepository.save(new Salvo(1, gamePlayer6, Arrays.asList("81", "82", "83")));
			Salvo salvo11 = salvoRepository.save(new Salvo(2, gamePlayer5, Arrays.asList("12", "13", "D8")));
			Salvo salvo12 = salvoRepository.save(new Salvo(2, gamePlayer6, Arrays.asList("51", "62", "73")));
			Salvo salvo13 = salvoRepository.save(new Salvo(1, gamePlayer7, Arrays.asList("13", "14", "67")));
			Salvo salvo14 = salvoRepository.save(new Salvo(1, gamePlayer8, Arrays.asList("25", "36", "81")));
			Salvo salvo15 = salvoRepository.save(new Salvo(2, gamePlayer7, Arrays.asList("12", "76", "86")));
			Salvo salvo16 = salvoRepository.save(new Salvo(2, gamePlayer8, Arrays.asList("35", "37", "45")));
			Salvo salvo17 = salvoRepository.save(new Salvo(1, gamePlayer9, Arrays.asList("11", "12", "13")));
			Salvo salvo18 = salvoRepository.save(new Salvo(1, gamePlayer10, Arrays.asList("25", "26", "37")));
			Salvo salvo19 = salvoRepository.save(new Salvo(2, gamePlayer9, Arrays.asList("76", "77", "78")));
			Salvo salvo20 = salvoRepository.save(new Salvo(2, gamePlayer10, Arrays.asList("36", "46", "56")));
			Salvo salvo21 = salvoRepository.save(new Salvo(3, gamePlayer10, Arrays.asList("81", "88")));
		};
	}
}