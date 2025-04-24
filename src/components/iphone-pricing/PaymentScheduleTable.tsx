'use client'

import * as React from 'react'
import {format} from 'date-fns'
import {vi} from 'date-fns/locale'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter} from '@/components/ui/table' // Added TableFooter
import {formatCurrency} from '@/lib/utils'
import {PaymentInstallment} from '@/lib/types' // Import the shared type

interface PaymentScheduleTableProps {
	paymentSchedule: PaymentInstallment[]
	startDate: Date | undefined // Needed to display dates if schedule doesn't contain them directly (depends on final calculation logic)
}

export function PaymentScheduleTable({paymentSchedule, startDate}: PaymentScheduleTableProps) {
	if (!paymentSchedule || paymentSchedule.length === 0 || !startDate) {
		return null // Don't render if there's no schedule or start date
	}

	// Calculate totals
	const totalPrincipal = paymentSchedule.reduce((sum, item) => sum + item.principalPayment, 0)
	const totalInterest = paymentSchedule.reduce((sum, item) => sum + item.interestPayment, 0)
	const totalPaid = paymentSchedule.reduce((sum, item) => sum + item.totalPayment, 0)

	return (
		<div className='w-full pt-4'>
			<h4 className='font-semibold mb-2'>Lịch thanh toán chi tiết (ước tính)</h4>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[50px]'>Kỳ</TableHead>
						<TableHead>Ngày TT</TableHead>
						<TableHead className='text-right'>Trả gốc</TableHead>
						<TableHead className='text-right'>Chi phí vay</TableHead>
						<TableHead className='text-right'>Tổng trả</TableHead>
						<TableHead className='text-right'>Dư nợ</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paymentSchedule.map((installment) => (
						<TableRow key={installment.installmentNumber}>
							<TableCell className='text-center'>{installment.installmentNumber}</TableCell>
							<TableCell>{format(installment.paymentDate, 'dd/MM/yy', {locale: vi})}</TableCell>
							<TableCell className='text-right'>{formatCurrency(installment.principalPayment)}</TableCell>
							<TableCell className='text-right'>{formatCurrency(installment.interestPayment)}</TableCell>
							<TableCell className='text-right'>{formatCurrency(installment.totalPayment)}</TableCell>
							<TableCell className='text-right'>{formatCurrency(installment.remainingBalance)}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow className='font-bold bg-muted/50'>
						<TableCell colSpan={2}>Tổng cộng</TableCell>
						<TableCell className='text-right'>{formatCurrency(totalPrincipal)}</TableCell>
						<TableCell className='text-right'>{formatCurrency(totalInterest)}</TableCell>
						<TableCell className='text-right'>{formatCurrency(totalPaid)}</TableCell>
						<TableCell /> {/* Empty cell for remaining balance column */}
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	)
}
