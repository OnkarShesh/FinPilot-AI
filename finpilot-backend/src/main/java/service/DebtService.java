package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.DebtPersonSummaryDto;
import com.onkar.finpilot.dto.DebtRecordDto;
import com.onkar.finpilot.dto.DebtRecordRequest;
import com.onkar.finpilot.dto.KhataOverviewDto;
import com.onkar.finpilot.entity.DebtPerson;
import com.onkar.finpilot.entity.DebtRecord;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.enums.DebtType;
import com.onkar.finpilot.repository.DebtPersonRepository;
import com.onkar.finpilot.repository.DebtRecordRepository;
import com.onkar.finpilot.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class DebtService {

    private final DebtPersonRepository personRepository;
    private final DebtRecordRepository recordRepository;

    public DebtService(DebtPersonRepository personRepository, DebtRecordRepository recordRepository) {
        this.personRepository = personRepository;
        this.recordRepository = recordRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        return ((CustomUserDetails) authentication.getPrincipal()).getUser();
    }

    @Transactional(readOnly = true)
    public KhataOverviewDto getOverview() {
        User user = getCurrentUser();
        return getOverviewForUser(user);
    }

    @Transactional(readOnly = true)
    public KhataOverviewDto getOverviewForUser(User user) {
        List<DebtPerson> persons = personRepository.findByUserOrderByNameAsc(user);
        List<DebtPersonSummaryDto> summaries = new ArrayList<>();

        BigDecimal totalReceivable = BigDecimal.ZERO;
        BigDecimal totalPayable = BigDecimal.ZERO;

        for (DebtPerson person : persons) {
            List<DebtRecord> records = recordRepository.findByPersonOrderByDateDescCreatedAtDesc(person);

            BigDecimal given = BigDecimal.ZERO;
            BigDecimal received = BigDecimal.ZERO;
            LocalDate lastDate = null;
            Instant lastCreatedAt = null;

            if (!records.isEmpty()) {
                lastDate = records.get(0).getDate();
                lastCreatedAt = records.get(0).getCreatedAt();
            }

            for (DebtRecord rec : records) {
                if (rec.getType() == DebtType.YOU_GAVE) {
                    given = given.add(rec.getAmount());
                } else {
                    received = received.add(rec.getAmount());
                }
            }

            BigDecimal net = given.subtract(received);

            if (net.compareTo(BigDecimal.ZERO) > 0) {
                totalReceivable = totalReceivable.add(net);
            } else if (net.compareTo(BigDecimal.ZERO) < 0) {
                totalPayable = totalPayable.add(net.abs());
            }

            summaries.add(DebtPersonSummaryDto.builder()
                    .id(person.getId())
                    .name(person.getName())
                    .phone(person.getPhone())
                    .netBalance(net)
                    .totalGiven(given)
                    .totalReceived(received)
                    .recordsCount(records.size())
                    .lastDate(lastDate)
                    .lastCreatedAt(lastCreatedAt)
                    .build());
        }

        // Sort: people with non-zero balances first, then by last active timestamp
        summaries.sort((a, b) -> {
            boolean aActive = a.getNetBalance().compareTo(BigDecimal.ZERO) != 0;
            boolean bActive = b.getNetBalance().compareTo(BigDecimal.ZERO) != 0;
            if (aActive != bActive) return aActive ? -1 : 1;
            
            Instant tA = a.getLastCreatedAt() != null ? a.getLastCreatedAt() : Instant.EPOCH;
            Instant tB = b.getLastCreatedAt() != null ? b.getLastCreatedAt() : Instant.EPOCH;
            return tB.compareTo(tA);
        });

        BigDecimal netBalance = totalReceivable.subtract(totalPayable);

        return KhataOverviewDto.builder()
                .totalReceivable(totalReceivable)
                .totalPayable(totalPayable)
                .netBalance(netBalance)
                .persons(summaries)
                .build();
    }

    @Transactional(readOnly = true)
    public List<DebtRecordDto> getPersonHistory(String personId) {
        User user = getCurrentUser();
        DebtPerson person = personRepository.findById(personId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Person not found"));

        if (!person.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        List<DebtRecord> records = recordRepository.findByPersonOrderByDateDescCreatedAtDesc(person);
        List<DebtRecordDto> dtos = new ArrayList<>();
        for (DebtRecord r : records) {
            dtos.add(DebtRecordDto.builder()
                    .id(r.getId())
                    .personId(person.getId())
                    .personName(person.getName())
                    .amount(r.getAmount())
                    .type(r.getType())
                    .notes(r.getNotes())
                    .date(r.getDate())
                    .createdAt(r.getCreatedAt())
                    .build());
        }
        return dtos;
    }

    @Transactional
    public DebtRecordDto addRecord(DebtRecordRequest request) {
        User user = getCurrentUser();
        return recordDebtForUser(user, request.getPersonName(), request.getPersonId(), null, request.getAmount(), request.getType(), request.getNotes(), request.getDate(), null);
    }

    @Transactional
    public DebtRecordDto recordDebtForUser(User user, String personName, String personId, String phone,
                                          BigDecimal amount, DebtType type, String notes,
                                          LocalDate date, Instant createdAt) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be greater than zero");
        }

        DebtPerson person = null;
        if (personId != null && !personId.isBlank()) {
            person = personRepository.findById(personId).orElse(null);
        }

        if (person == null && personName != null && !personName.isBlank()) {
            String cleanName = personName.trim();
            cleanName = Character.toUpperCase(cleanName.charAt(0)) + cleanName.substring(1);
            person = personRepository.findByUserAndNameIgnoreCase(user, cleanName)
                    .orElseGet(() -> {
                        DebtPerson p = new DebtPerson();
                        p.setName(personName.trim());
                        p.setUser(user);
                        return personRepository.save(p);
                    });
        }

        if (person == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Person name is required");
        }

        if (phone != null && !phone.isBlank() && (person.getPhone() == null || person.getPhone().isBlank())) {
            person.setPhone(phone);
            personRepository.save(person);
        }

        DebtRecord record = new DebtRecord();
        record.setUser(user);
        record.setPerson(person);
        record.setAmount(amount);
        record.setType(type != null ? type : DebtType.YOU_GAVE);
        record.setNotes(notes);
        record.setDate(date != null ? date : LocalDate.now(ZoneId.of("Asia/Kolkata")));
        record.setCreatedAt(createdAt != null ? createdAt : Instant.now());
        record.setUpdatedAt(record.getCreatedAt());

        DebtRecord saved = recordRepository.save(record);

        return DebtRecordDto.builder()
                .id(saved.getId())
                .personId(person.getId())
                .personName(person.getName())
                .amount(saved.getAmount())
                .type(saved.getType())
                .notes(saved.getNotes())
                .date(saved.getDate())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional
    public DebtRecordDto settlePerson(String personId) {
        User user = getCurrentUser();
        DebtPerson person = personRepository.findById(personId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Person not found"));

        if (!person.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        List<DebtRecord> records = recordRepository.findByPerson(person);
        BigDecimal given = BigDecimal.ZERO;
        BigDecimal received = BigDecimal.ZERO;
        for (DebtRecord r : records) {
            if (r.getType() == DebtType.YOU_GAVE) given = given.add(r.getAmount());
            else received = received.add(r.getAmount());
        }

        BigDecimal net = given.subtract(received);
        if (net.compareTo(BigDecimal.ZERO) == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Account is already settled (balance is ₹0)");
        }

        DebtType settleType = net.compareTo(BigDecimal.ZERO) > 0 ? DebtType.YOU_GOT : DebtType.YOU_GAVE;
        BigDecimal settleAmount = net.abs();

        return recordDebtForUser(user, person.getName(), person.getId(), null, settleAmount, settleType,
                "✅ Full Account Settlement", LocalDate.now(ZoneId.of("Asia/Kolkata")), Instant.now());
    }

    @Transactional
    public void deletePerson(String personId) {
        User user = getCurrentUser();
        DebtPerson person = personRepository.findById(personId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Person not found"));

        if (!person.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        personRepository.delete(person);
    }

    @Transactional
    public void deleteRecord(String recordId) {
        User user = getCurrentUser();
        DebtRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found"));

        if (!record.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        recordRepository.delete(record);
    }

    @Transactional(readOnly = true)
    public BigDecimal getNetBalanceForPerson(DebtPerson person) {
        List<DebtRecord> records = recordRepository.findByPerson(person);
        BigDecimal given = BigDecimal.ZERO;
        BigDecimal received = BigDecimal.ZERO;
        for (DebtRecord r : records) {
            if (r.getType() == DebtType.YOU_GAVE) given = given.add(r.getAmount());
            else received = received.add(r.getAmount());
        }
        return given.subtract(received);
    }
}
