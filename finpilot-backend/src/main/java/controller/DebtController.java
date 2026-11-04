package com.onkar.finpilot.controller;

import com.onkar.finpilot.dto.DebtRecordDto;
import com.onkar.finpilot.dto.DebtRecordRequest;
import com.onkar.finpilot.dto.KhataOverviewDto;
import com.onkar.finpilot.service.DebtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtService debtService;

    public DebtController(DebtService debtService) {
        this.debtService = debtService;
    }

    @GetMapping("/overview")
    public ResponseEntity<KhataOverviewDto> getOverview() {
        return ResponseEntity.ok(debtService.getOverview());
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<DebtRecordDto>> getPersonHistory(@PathVariable String personId) {
        return ResponseEntity.ok(debtService.getPersonHistory(personId));
    }

    @PostMapping
    public ResponseEntity<DebtRecordDto> addRecord(@RequestBody DebtRecordRequest request) {
        return ResponseEntity.ok(debtService.addRecord(request));
    }

    @PostMapping("/settle/{personId}")
    public ResponseEntity<DebtRecordDto> settlePerson(@PathVariable String personId) {
        return ResponseEntity.ok(debtService.settlePerson(personId));
    }

    @DeleteMapping("/person/{personId}")
    public ResponseEntity<Map<String, String>> deletePerson(@PathVariable String personId) {
        debtService.deletePerson(personId);
        return ResponseEntity.ok(Map.of("message", "Person and all history deleted successfully"));
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<Map<String, String>> deleteRecord(@PathVariable String recordId) {
        debtService.deleteRecord(recordId);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully"));
    }
}
