package com.mindhub.salvo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;


@RepositoryRestResource
public interface SalvoRepository extends JpaRepository<Salvo, Long> {
    List<Ship> findByTurn(Integer turn);
}