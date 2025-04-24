'use client'

import * as React from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {formatCurrency} from '@/lib/utils' // Import formatCurrency

interface PaymentScheduleTableProps {
	loanMonths: number
	monthlyPayment: number
	totalPayment: number
}

export function PaymentScheduleTable({loanMonths, monthlyPayment, totalPayment}: PaymentScheduleTableProps) {
	if (loanMonths <= 0 || totalPayment <= 0) {
		return null // Don't render if there's nothing to show
	}

	return (
		<div className='w-full pt-4'>
			<h4 className='font-semibold mb-2'>Lịch thanh toán dự kiến</h4>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[100px]'>Kỳ</TableHead>
						<TableHead className='text-right'>Số tiền</TableHead>
						{/* Add other columns later if needed */}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({length: loanMonths}, (_, i) => (
						<TableRow key={i}>
							<TableCell>Tháng {i + 1}</TableCell>
							<TableCell className='text-right'>{formatCurrency(monthlyPayment)}</TableCell>
						</TableRow>
					))}
					<TableRow className='font-bold bg-muted/50'>
						<TableCell>Tổng cộng</TableCell>
						<TableCell className='text-right'>{formatCurrency(totalPayment)}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	)
}
