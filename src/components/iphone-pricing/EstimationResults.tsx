'use client'

import * as React from 'react'
import {PaymentScheduleTable} from './PaymentScheduleTable' // Import Payment Schedule Table
import {ImportantNotes} from './ImportantNotes' // Import Important Notes
import {formatCurrency} from '@/lib/utils' // Import formatCurrency

interface EstimationResultsProps {
	selectedModel: string
	selectedStorage: string
	conditionPercentage: number
	marketPrice: number
	loanRatio: number
	loanPrincipal: number
	loanMonths: number
	loanCost: number
	totalPayment: number
	monthlyPayment: number
	interestRate: number
}

export function EstimationResults({selectedModel, selectedStorage, conditionPercentage, marketPrice, loanRatio, loanPrincipal, loanMonths, loanCost, totalPayment, monthlyPayment, interestRate}: EstimationResultsProps) {
	const showResults = marketPrice > 0 && selectedModel && selectedStorage

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
							<span>Gốc vay ({loanRatio}%):</span>
							<span className='font-medium'>{formatCurrency(loanPrincipal)}</span>
						</div>
						<div className='flex justify-between'>
							<span>Chi phí vay ({loanMonths} tháng):</span>
							<span className='font-medium'>{formatCurrency(loanCost)}</span>
						</div>
						<div className='flex justify-between font-bold pt-2 border-t mt-2'>
							<span>Tổng thanh toán ước tính:</span>
							<span>{formatCurrency(totalPayment)}</span>
						</div>
						<div className='w-full pt-4 text-sm text-muted-foreground space-y-1'>
							<p>• Đây là ước tính dựa trên giá tham khảo và lãi suất cố định ({interestRate}%/tháng). Giá thực tế có thể thay đổi.</p>
							<p>• Khoản vay và lịch thanh toán chỉ mang tính tham khảo, không phải là đề nghị cho vay chính thức.</p>
							<p>• Liên hệ với cửa hàng để biết thông tin chi tiết và thủ tục vay chính xác.</p>
						</div>
					</div>

					<PaymentScheduleTable loanMonths={loanMonths} monthlyPayment={monthlyPayment} totalPayment={totalPayment} />
					<ImportantNotes />
				</>
			) : (
				<p className='text-muted-foreground w-full text-center'>Vui lòng chọn dòng máy, dung lượng và độ mới để xem ước tính.</p>
			)}
		</>
	)
}
