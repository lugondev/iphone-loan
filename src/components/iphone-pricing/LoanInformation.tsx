'use client'

'use client'

import * as React from 'react'
import {Calendar as CalendarIcon} from 'lucide-react'
import {format} from 'date-fns'
import {vi} from 'date-fns/locale' // Import Vietnamese locale

import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Calendar} from '@/components/ui/calendar'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Slider} from '@/components/ui/slider'

interface LoanInformationProps {
	loanAmount: number
	setLoanAmount: (amount: number) => void
	marketPrice: number
	loanMonths: number
	setLoanMonths: (months: number) => void
	startDate: Date | undefined
	setStartDate: (date: Date | undefined) => void
}

export function LoanInformation({loanAmount, setLoanAmount, marketPrice, loanMonths, setLoanMonths, startDate, setStartDate}: LoanInformationProps) {
	// State for controlling the popover visibility
	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
	const maxLoanAmount = Math.floor(marketPrice / 2) // Maximum loan amount is 50% of the market price

	return (
		<div className='space-y-6'>
			{' '}
			{/* Increased spacing */}
			<h3 className='text-lg font-semibold'>Thông tin khoản vay</h3>
			{/* Loan Amount Input */}
			<div className='space-y-2'>
				<Label htmlFor='loanAmount'>Số tiền vay</Label>
				<div className='flex items-center space-x-2'>
					<Input
						id='loanAmount'
						type='number'
						value={loanAmount}
						onChange={(e) => {
							const value = Number(e.target.value)
							setLoanAmount(Math.max(0, Math.min(maxLoanAmount, value)))
						}}
						placeholder='1000000'
						min='0'
						max={maxLoanAmount}
						className='flex-1'
					/>
					<span className='font-medium'>đ</span>
				</div>
				<p className='text-sm text-muted-foreground'>Số tiền vay tối đa: {maxLoanAmount.toLocaleString('vi-VN')}đ</p>
			</div>
			{/* Loan Months Slider */}
			<div className='space-y-3'>
				{' '}
				{/* Increased spacing */}
				<Label htmlFor='loanMonths'>Số tháng vay ({loanMonths} tháng)</Label>
				<Slider
					id='loanMonths'
					min={1}
					max={6}
					step={1}
					value={[loanMonths]}
					onValueChange={(value) => setLoanMonths(value[0])}
					className='pt-1' // Add padding top for better spacing
				/>
				<p className='text-sm text-muted-foreground'>Chọn số tháng vay (từ 1 đến 6 tháng).</p>
			</div>
			{/* Start Date Picker */}
			<div className='space-y-2'>
				<Label htmlFor='startDate'>Ngày bắt đầu vay</Label>
				<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
					<PopoverTrigger asChild>
						<Button
							variant={'outline'}
							className={cn(
								'w-full justify-start text-left font-normal', // Changed width to full
								!startDate && 'text-muted-foreground',
							)}>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{startDate ? format(startDate, 'PPP', {locale: vi}) : <span>Chọn ngày</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0'>
						<Calendar
							locale={vi} // Use Vietnamese locale
							mode='single'
							selected={startDate}
							onSelect={(date) => {
								setStartDate(date)
								setIsPopoverOpen(false) // Close popover on date selection
							}}
							initialFocus
							disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
						/>
					</PopoverContent>
				</Popover>
				<p className='text-sm text-muted-foreground'>Chọn ngày bắt đầu giải ngân.</p>
			</div>
		</div>
	)
}
