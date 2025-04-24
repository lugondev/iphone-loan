'use client'

import {useState, useEffect, useMemo} from 'react'
import {calculateLoanPayments} from '@/lib/utils'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {DeviceInformation} from '@/components/iphone-pricing/DeviceInformation' // Import DeviceInformation
import {LoanInformation} from '@/components/iphone-pricing/LoanInformation' // Import LoanInformation
import {EstimationResults} from '@/components/iphone-pricing/EstimationResults' // Import EstimationResults
import iphonePriceList from '@/lib/iphone_price_list_partial.json' // Import the data
import {PaymentInstallment} from '@/lib/types' // Import the shared type

interface IphoneData {
	model: string
	storage: string
	price_range_vnd: number[]
}

// Local definition removed - using imported type

export default function Home() {
	const [selectedModel, setSelectedModel] = useState<string>('')
	const [selectedStorage, setSelectedStorage] = useState<string>('')
	const [conditionPercentage, setConditionPercentage] = useState<number>(99) // Default 99% condition
	const [loanMonths, setLoanMonths] = useState<number>(1) // Default 1 month
	const [startDate, setStartDate] = useState<Date | undefined>(new Date()) // Default today

	// State for Model Search Popover
	const [modelPopoverOpen, setModelPopoverOpen] = useState(false)

	// Market Price and Loan Amount
	const [marketPrice, setMarketPrice] = useState<number>(0)
	const [loanAmount, setLoanAmount] = useState<number>(0)

	// Results
	const [paymentSchedule, setPaymentSchedule] = useState<PaymentInstallment[]>([])
	const [totalInterestPaid, setTotalInterestPaid] = useState<number>(0)
	const [totalPaid, setTotalPaid] = useState<number>(0)

	const models = useMemo(() => {
		const uniqueModels = new Set(iphonePriceList.map((item) => item.model))
		return Array.from(uniqueModels)
	}, [])

	const availableStorages = useMemo(() => {
		if (!selectedModel) return []
		return iphonePriceList.filter((item) => item.model === selectedModel).map((item) => item.storage)
	}, [selectedModel])

	useEffect(() => {
		// Reset storage when model changes
		setSelectedStorage('')
		setMarketPrice(0)
	}, [selectedModel])

	useEffect(() => {
		if (selectedModel && selectedStorage) {
			const selectedPhone = iphonePriceList.find((item: IphoneData) => item.model === selectedModel && item.storage === selectedStorage)
			const basePrice = selectedPhone?.price_range_vnd[0] || 0
			// Adjust price based on condition
			const adjustedPrice = basePrice * (conditionPercentage / 100)
			setMarketPrice(adjustedPrice)
		} else {
			setMarketPrice(0)
		}
	}, [selectedModel, selectedStorage, conditionPercentage])

	// Effect to update loan amount when market price changes
	useEffect(() => {
		if (marketPrice === 0) {
			setLoanAmount(0)
		} else {
			setLoanAmount(Math.floor(marketPrice / 3)) // Set default loan amount to 1/3 of market price
		}
	}, [marketPrice])

	useEffect(() => {
		setPaymentSchedule([])
		setTotalInterestPaid(0)
		setTotalPaid(0)

		if (loanAmount <= 0 || !startDate || loanMonths < 1 || loanMonths > 6) {
			return // Exit if inputs are invalid
		}

		const {schedule, totalInterest, totalPayment} = calculateLoanPayments(loanAmount, loanMonths, startDate)

		setPaymentSchedule(schedule)
		setTotalInterestPaid(totalInterest)
		setTotalPaid(totalPayment)
	}, [loanAmount, loanMonths, startDate])

	return (
		<div className='flex items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900'>
			<Card className='w-full max-w-4xl'>
				<CardHeader>
					{/* Updated Title and Description */}
					<CardTitle>Ước Tính Giá iPhone Cũ & Khoản Vay</CardTitle>
					<CardDescription>Công cụ giúp bạn tham khảo giá thị trường và ước tính khoản vay.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Device Information Component */}
					<DeviceInformation models={models} availableStorages={availableStorages} selectedModel={selectedModel} setSelectedModel={setSelectedModel} selectedStorage={selectedStorage} setSelectedStorage={setSelectedStorage} conditionPercentage={conditionPercentage} setConditionPercentage={setConditionPercentage} modelPopoverOpen={modelPopoverOpen} setModelPopoverOpen={setModelPopoverOpen} />

					{/* Loan Information Component */}
					<LoanInformation loanAmount={loanAmount} setLoanAmount={setLoanAmount} marketPrice={marketPrice} loanMonths={loanMonths} setLoanMonths={setLoanMonths} startDate={startDate} setStartDate={setStartDate} />
				</CardContent>
				<CardFooter className='flex flex-col items-start space-y-4 border-t pt-6'>
					{/* Estimation Results Component - Props will be updated later */}
					<EstimationResults
						selectedModel={selectedModel}
						selectedStorage={selectedStorage}
						conditionPercentage={conditionPercentage}
						marketPrice={marketPrice}
						loanAmount={loanAmount}
						loanMonths={loanMonths}
						// Corrected props based on EstimationResults interface
						totalInterestPaid={totalInterestPaid}
						totalPaid={totalPaid}
						paymentSchedule={paymentSchedule} // Pass the schedule
						startDate={startDate} // Pass the start date
					/>
				</CardFooter>
			</Card>
		</div>
	)
}
