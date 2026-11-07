package com.onkar.finpilot.repository;

import com.onkar.finpilot.entity.DebtPerson;
import com.onkar.finpilot.entity.DebtRecord;
import com.onkar.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DebtRecordRepository extends JpaRepository<DebtRecord, String> {

    @Query("SELECT r FROM DebtRecord r WHERE r.user = :user ORDER BY r.date DESC, r.createdAt DESC NULLS LAST")
    List<DebtRecord> findByUserOrderByDateDescCreatedAtDesc(User user);

    @Query("SELECT r FROM DebtRecord r WHERE r.person = :person ORDER BY r.date DESC, r.createdAt DESC NULLS LAST")
    List<DebtRecord> findByPersonOrderByDateDescCreatedAtDesc(DebtPerson person);

    List<DebtRecord> findByPerson(DebtPerson person);
}

