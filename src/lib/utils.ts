import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addDays, addMonths } from "date-fns"
import { PaymentInstallment } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// Principal payment percentages for different loan terms
const PRINCIPAL_PAYMENT_PERCENTAGES = {
  3: [24, 37, 39],
  4: [15, 21, 28, 36],
  5: [8, 14, 18, 26, 34],
  6: [5, 17, 18, 19, 20, 21]
}

export const calculateLoanPayments = (
  principal: number,
  months: number,
  startDate: Date
): {
  schedule: PaymentInstallment[],
  totalInterest: number,
  totalPayment: number
} => {
  const schedule: PaymentInstallment[] = []
  let remainingPrincipal = principal
  let totalInterest = 0

  // Calculate total interest based on loan term
  if (months <= 2) {
    // 1-2 month loans: upfront interest
    totalInterest = principal * (months === 1 ? 0.075 : 0.15)
  } else {
    // 3-6 month loans: Calculate interest based on principal percentages
    const principalPercentages = PRINCIPAL_PAYMENT_PERCENTAGES[months as keyof typeof PRINCIPAL_PAYMENT_PERCENTAGES]
    for (let i = 0; i < months; i++) {
      const principalPayment = principal * (principalPercentages[i] / 100)
      remainingPrincipal -= principalPayment
      totalInterest += remainingPrincipal * 0.075 // 7.5% monthly interest on remaining balance
    }
  }

  const totalAmount = principal + totalInterest
  const equalMonthlyPayment = totalAmount / months

  // Generate payment schedule
  if (months <= 2) {
    // First payment - interest only on day one
    schedule.push({
      installmentNumber: 1,
      paymentDate: startDate,
      principalPayment: 0,
      interestPayment: totalInterest,
      totalPayment: totalInterest,
      remainingBalance: principal
    })

    const principalPerPayment = principal / 2 // Always split principal in half

    if (months === 1) {
      // For 1 month: two principal payments
      schedule.push({
        installmentNumber: 2,
        paymentDate: addDays(startDate, 15),
        principalPayment: principalPerPayment,
        interestPayment: 0,
        totalPayment: principalPerPayment,
        remainingBalance: principalPerPayment
      })

      schedule.push({
        installmentNumber: 3,
        paymentDate: addDays(startDate, 30),
        principalPayment: principalPerPayment,
        interestPayment: 0,
        totalPayment: principalPerPayment,
        remainingBalance: 0
      })
    } else {
      // For 2 months: two principal payments
      for (let i = 2; i <= 3; i++) {
        schedule.push({
          installmentNumber: i,
          paymentDate: addDays(startDate, (i - 1) * 15),
          principalPayment: principalPerPayment,
          interestPayment: 0,
          totalPayment: principalPerPayment,
          remainingBalance: i === 3 ? 0 : principalPerPayment
        })
      }
    }
  } else {
    // For 3-6 month loans
    remainingPrincipal = principal
    const principalPercentages = PRINCIPAL_PAYMENT_PERCENTAGES[months as keyof typeof PRINCIPAL_PAYMENT_PERCENTAGES]

    for (let month = 1; month <= months; month++) {
      const principalPayment = month === months
        ? remainingPrincipal
        : principal * (principalPercentages[month - 1] / 100)
      const interestPayment = remainingPrincipal * 0.075
      remainingPrincipal -= principalPayment

      schedule.push({
        installmentNumber: month,
        paymentDate: addMonths(startDate, month), // Start from next month
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        totalPayment: equalMonthlyPayment,
        remainingBalance: remainingPrincipal
      })
    }
  }

  return {
    schedule,
    totalInterest,
    totalPayment: totalAmount
  }
}
