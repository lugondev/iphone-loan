'use client'

import * as React from 'react'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

interface LoanInformationProps {
	loanRatio: number
	setLoanRatio: (ratio: number) => void
	loanMonths: number
	setLoanMonths: (months: number) => void
	interestRate: number
	setInterestRate: (rate: number) => void
}

export function LoanInformation({loanRatio, setLoanRatio, loanMonths, setLoanMonths, interestRate, setInterestRate}: LoanInformationProps) {
	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold'>Thông tin khoản vay</h3>
			{/* Loan Ratio Input */}
			<div className='space-y-2'>
				<Label htmlFor='loanRatio'>Tỷ lệ cầm</Label>
				<div className='flex items-center space-x-2'>
					<Input id='loanRatio' type='number' value={loanRatio} onChange={(e) => setLoanRatio(Math.max(0, Math.min(100, Number(e.target.value))))} placeholder='30' min='0' max='100' className='flex-1' />
					<span className='font-medium'>%</span>
				</div>
				<p className='text-sm text-muted-foreground'>Tỷ lệ phần trăm giá trị máy được cho vay.</p>
			</div>

			{/* Loan Months Input */}
			<div className='space-y-2'>
				<Label htmlFor='loanMonths'>Số tháng vay</Label>
				<Input id='loanMonths' type='number' value={loanMonths} onChange={(e) => setLoanMonths(Math.max(1, Number(e.target.value)))} placeholder='3' min='1' />
				<p className='text-sm text-muted-foreground'>Số tháng dự kiến hoàn trả khoản vay.</p>
			</div>

			{/* Interest Rate Input */}
			<div className='space-y-2'>
				<Label htmlFor='interestRate'>Lãi suất tháng (%)</Label>
				<Input id='interestRate' type='number' step='0.1' value={interestRate} onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))} placeholder='Nhập lãi suất %' min='0' />
				<p className='text-sm text-muted-foreground'>Lãi suất mô phỏng tính theo tháng.</p>
			</div>
		</div>
	)
}
