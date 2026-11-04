package com.onkar.finpilot.repository;

import com.onkar.finpilot.entity.DebtPerson;
import com.onkar.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DebtPersonRepository extends JpaRepository<DebtPerson, String> {

    List<DebtPerson> findByUserOrderByNameAsc(User user);

    Optional<DebtPerson> findByUserAndNameIgnoreCase(User user, String name);
}
