package com.onkar.finpilot.dto;

public class ExpenseItem {

    private String category;
    private double amount;

    public ExpenseItem() {
    }

    public ExpenseItem(String category, double amount) {
        this.category = category;
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}