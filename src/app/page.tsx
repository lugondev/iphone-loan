'use client'

'use client'

import {useState, useEffect, useMemo} from 'react'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {DeviceInformation} from '@/components/iphone-pricing/DeviceInformation' // Import DeviceInformation
import {LoanInformation} from '@/components/iphone-pricing/LoanInformation' // Import LoanInformation
import {EstimationResults} from '@/components/iphone-pricing/EstimationResults' // Import EstimationResults
import iphonePriceList from '@/lib/iphone_price_list_partial.json' // Import the data

interface IphoneData {
	model: string
	storage: string
	price_range_vnd: number[]
}

export default function Home() {
	const [selectedModel, setSelectedModel] = useState<string>('')
	const [selectedStorage, setSelectedStorage] = useState<string>('')
	const [conditionPercentage, setConditionPercentage] = useState<number>(99) // Default 99% condition
	const [loanRatio, setLoanRatio] = useState<number>(30) // Default 30%
	const [loanMonths, setLoanMonths] = useState<number>(3) // Default 3 months
	const [interestRate, setInterestRate] = useState<number>(1.5) // Default 1.5% per month

	// State for Model Search Popover
	const [modelPopoverOpen, setModelPopoverOpen] = useState(false)

	const [marketPrice, setMarketPrice] = useState<number>(0)
	const [loanPrincipal, setLoanPrincipal] = useState<number>(0)
	const [loanCost, setLoanCost] = useState<number>(0)
	const [totalPayment, setTotalPayment] = useState<number>(0)
	const [monthlyPayment, setMonthlyPayment] = useState<number>(0) // State for monthly payment

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
	}, [selectedModel, selectedStorage, conditionPercentage]) // Add conditionPercentage dependency

	useEffect(() => {
		// Recalculate loan details when inputs change
		if (marketPrice > 0 && loanRatio > 0 && loanMonths > 0 && interestRate >= 0) {
			const principal = marketPrice * (loanRatio / 100)
			const cost = principal * (interestRate / 100) * loanMonths
			const total = principal + cost

			setLoanPrincipal(principal)
			setLoanCost(cost)
			setTotalPayment(total)
		} else {
			setLoanPrincipal(0)
			setLoanCost(0)
			setTotalPayment(0)
			setMonthlyPayment(0) // Reset monthly payment
		}
	}, [marketPrice, loanRatio, loanMonths, interestRate])

	// Calculate monthly payment when total payment changes
	useEffect(() => {
		if (totalPayment > 0 && loanMonths > 0) {
			setMonthlyPayment(totalPayment / loanMonths)
		} else {
			setMonthlyPayment(0)
		}
	}, [totalPayment, loanMonths])

	return (
		<div className='flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900'>
			<Card className='w-full max-w-lg'>
				<CardHeader>
					{/* Updated Title and Description */}
					<CardTitle>Ước Tính Giá iPhone Cũ & Khoản Vay</CardTitle>
					<CardDescription>Công cụ giúp bạn tham khảo giá thị trường và ước tính khoản vay.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Device Information Component */}
					<DeviceInformation models={models} availableStorages={availableStorages} selectedModel={selectedModel} setSelectedModel={setSelectedModel} selectedStorage={selectedStorage} setSelectedStorage={setSelectedStorage} conditionPercentage={conditionPercentage} setConditionPercentage={setConditionPercentage} modelPopoverOpen={modelPopoverOpen} setModelPopoverOpen={setModelPopoverOpen} />

					{/* Loan Information Component */}
					<LoanInformation loanRatio={loanRatio} setLoanRatio={setLoanRatio} loanMonths={loanMonths} setLoanMonths={setLoanMonths} interestRate={interestRate} setInterestRate={setInterestRate} />
				</CardContent>
				<CardFooter className='flex flex-col items-start space-y-4 border-t pt-6'>
					{/* Estimation Results Component */}
					<EstimationResults selectedModel={selectedModel} selectedStorage={selectedStorage} conditionPercentage={conditionPercentage} marketPrice={marketPrice} loanRatio={loanRatio} loanPrincipal={loanPrincipal} loanMonths={loanMonths} loanCost={loanCost} totalPayment={totalPayment} monthlyPayment={monthlyPayment} interestRate={interestRate} />
				</CardFooter>
			</Card>
		</div>
	)
}
