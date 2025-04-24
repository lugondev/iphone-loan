// Define the structure for each payment installment
export interface PaymentInstallment {
	installmentNumber: number;
	paymentDate: Date;
	principalPayment: number;
	interestPayment: number;
	totalPayment: number;
	remainingBalance: number;
}
