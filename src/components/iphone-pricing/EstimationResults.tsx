'use client'

import * as React from 'react'
import {PaymentScheduleTable} from './PaymentScheduleTable' // Import Payment Schedule Table
import {ImportantNotes} from './ImportantNotes' // Import Important Notes
import {formatCurrency} from '@/lib/utils' // Import formatCurrency
import {PaymentInstallment} from '@/lib/types' // Import the shared type

interface EstimationResultsProps {
	selectedModel: string
	selectedStorage: string
	conditionPercentage: number
	marketPrice: number
	loanAmount: number
	loanMonths: number
	totalInterestPaid: number
	totalPaid: number
	paymentSchedule: PaymentInstallment[]
	startDate: Date | undefined
}

export function EstimationResults({selectedModel, selectedStorage, conditionPercentage, marketPrice, loanAmount, loanMonths, totalInterestPaid, totalPaid, paymentSchedule, startDate}: EstimationResultsProps) {
	const showResults = marketPrice > 0 && selectedModel && selectedStorage && loanAmount > 0

	return (
		<>
			<h3 className='text-lg font-semibold mb-2 w-full'>Kết quả ước tính</h3>
			{showResults ? (
				<>
					<div className='w-full space-y-4'>
						<div className='flex justify-between'>
							<span>Giá tham khảo ({conditionPercentage}%):</span>
							<span className='font-medium'>{formatCurrency(marketPrice)}</span>
						</div>
						<div className='flex justify-between'>
							<span>Gốc vay:</span>
							<span className='font-medium'>{formatCurrency(loanAmount)}</span>
						</div>
						<div className='flex justify-between'>
							<span>Tổng lãi ước tính ({loanMonths} tháng):</span>
							<span className='font-medium'>{formatCurrency(totalInterestPaid)}</span>
						</div>
						<div className='flex justify-between font-bold pt-2 border-t mt-2'>
							<span>Tổng phải trả ước tính:</span>
							<span>{formatCurrency(totalPaid)}</span>
						</div>
						<div className='w-full pt-4 text-sm text-muted-foreground space-y-1'>
							<p>• Đây là ước tính dựa trên giá tham khảo. Lãi suất và gốc trả hàng tháng có thể thay đổi tùy theo thời hạn vay.</p>
							<p>• Khoản vay và lịch thanh toán chỉ mang tính tham khảo, không phải là đề nghị cho vay chính thức.</p>
							<p>• Liên hệ với cửa hàng để biết thông tin chi tiết và thủ tục vay chính xác.</p>
						</div>
					</div>

					{/* Pass the detailed schedule and start date */}
					<PaymentScheduleTable paymentSchedule={paymentSchedule} startDate={startDate} />
					<ImportantNotes />
				</>
			) : (
				<p className='text-muted-foreground w-full text-center'>Vui lòng chọn dòng máy, dung lượng và độ mới để xem ước tính.</p>
			)}
		</>
	)
}
