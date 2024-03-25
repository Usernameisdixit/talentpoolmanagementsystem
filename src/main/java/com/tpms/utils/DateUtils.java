package com.tpms.utils;

import java.time.LocalDate;

import java.time.Period;


public class DateUtils {
	public static String monthDayDifference(String date1, String date2) {
		
		//DateTimeFormatter f = DateTimeFormatter.ofPattern ( "yyyy-MM-dd" );
	  
		//LocalDateTime locadatetime1= LocalDateTime.parse(date1, f);
		//LocalDateTime locadatetime2= LocalDateTime.parse(date2, f);
		
		//LocalDate localDate1 = locadatetime1.toLocalDate();
		//LocalDate localDate2 = locadatetime2.toLocalDate();
        // Parse date strings into LocalDate objects
		LocalDate localDate1 = LocalDate.parse(date1);
        LocalDate localDate2 = LocalDate.parse(date2);

        // Calculate difference between dates
        Period period = Period.between(localDate1, localDate2);

        // Extract months and remaining days from period
        int months = period.getYears() * 12 + period.getMonths();
        int remainingDays = period.getDays();

       // String retMonthAndDay = "Difference: " + months + " months and " + remainingDays + " days";
        String retMonthAndDay = months + " months, " + remainingDays + " days";
        System.out.println(retMonthAndDay);
        return retMonthAndDay;
    }
}
