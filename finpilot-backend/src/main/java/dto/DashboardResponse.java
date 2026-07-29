package com.onkar.finpilot.dto;

public class DashboardResponse {

    private double totalIncome;
    private double totalExpense;
    private double savings;
    private long totalTransactions;

    public DashboardResponse() {
    }

    public DashboardResponse(double totalIncome, double totalExpense,
                             double savings, long totalTransactions) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.savings = savings;
        this.totalTransactions = totalTransactions;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public double getSavings() {
        return savings;
    }

    public void setSavings(double savings) {
        this.savings = savings;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }
}