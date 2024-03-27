package com.tpms.utils;

import java.time.LocalDate;


import java.time.Period;





public class DateUtils {
	public static String monthDayDifference(String date1, String date2) {
		

        // Parse date strings into LocalDate objects
		LocalDate localDate1 = LocalDate.parse(date1);
        LocalDate localDate2 = LocalDate.parse(date2);

        // Calculate difference between dates
        Period period = Period.between(localDate1, localDate2);

        // Extract months and remaining days from period
        int months = period.getYears() * 12 + period.getMonths();
        int remainingDays = period.getDays();

        return months + " months, " + remainingDays + " days";
    }
}
