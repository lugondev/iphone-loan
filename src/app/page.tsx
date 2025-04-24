'use client'

'use client'

import {useState, useEffect, useMemo} from 'react'
import {Check, ChevronsUpDown} from 'lucide-react' // Import icons

import {cn} from '@/lib/utils' // Import cn utility
import {Button} from '@/components/ui/button' // Import Button
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command' // Import Command components
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover' // Import Popover components
// Keep Select imports if needed elsewhere, otherwise remove
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Checkbox} from '@/components/ui/checkbox' // Import Checkbox
import {Slider} from '@/components/ui/slider' // Import Slider
import iphonePriceList from '@/lib/iphone_price_list_partial.json' // Import the data

interface IphoneData {
	model: string
	storage: string
	price_range_vnd: number[]
}

// Helper to format currency
const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(value)
}

export default function Home() {
	const [selectedModel, setSelectedModel] = useState<string>('')
	const [selectedStorage, setSelectedStorage] = useState<string>('')
	const [conditionPercentage, setConditionPercentage] = useState<number>(99) // Default 99% condition
	const [loanRatio, setLoanRatio] = useState<number>(30) // Default 50%
	const [loanMonths, setLoanMonths] = useState<number>(3) // Default 12 months
	const [interestRate] = useState<number>(1.5) // Default 1.5% per month

	// State for Model Search Popover
	const [modelPopoverOpen, setModelPopoverOpen] = useState(false)

	const [marketPrice, setMarketPrice] = useState<number>(0)
	const [loanPrincipal, setLoanPrincipal] = useState<number>(0)
	const [loanCost, setLoanCost] = useState<number>(0)
	const [totalPayment, setTotalPayment] = useState<number>(0)

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
		}
	}, [marketPrice, loanRatio, loanMonths, interestRate])

	return (
		<div className='flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900'>
			<Card className='w-full max-w-lg'>
				<CardHeader>
					<CardTitle>Tính Giá Trị Khoản Vay iPhone</CardTitle>
					<CardDescription>Chọn mẫu iPhone và nhập thông tin vay để ước tính.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Model Selection with Search */}
					<div className='space-y-2'>
						<Label>Chọn dòng máy iPhone</Label>
						<Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
							<PopoverTrigger asChild>
								<Button variant='outline' role='combobox' aria-expanded={modelPopoverOpen} className='w-full justify-between'>
									{selectedModel ? models.find((model) => model === selectedModel) : 'Chọn dòng máy...'}
									<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
								<Command>
									<CommandInput placeholder='Tìm dòng máy...' />
									<CommandList>
										<CommandEmpty>Không tìm thấy dòng máy.</CommandEmpty>
										<CommandGroup>
											{models.map((model) => (
												<CommandItem
													key={model}
													value={model}
													onSelect={(currentValue) => {
														setSelectedModel(currentValue === selectedModel ? '' : currentValue)
														setModelPopoverOpen(false)
													}}>
													<Check className={cn('mr-2 h-4 w-4', selectedModel === model ? 'opacity-100' : 'opacity-0')} />
													{model}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>

					{/* Storage Selection with Checkboxes */}
					{selectedModel && (
						<div className='space-y-2'>
							<Label>Chọn dung lượng</Label>
							<div className='flex flex-wrap gap-2'>
								{availableStorages.map((storage) => (
									<div key={storage} className='flex items-center space-x-2'>
										<Checkbox
											id={`storage-${storage}`}
											checked={selectedStorage === storage}
											onCheckedChange={(checked: boolean | 'indeterminate') => {
												if (checked === true) {
													// Explicitly check for true
													setSelectedStorage(storage)
												} else if (selectedStorage === storage) {
													// Allow unchecking the current selection
													setSelectedStorage('')
												}
											}}
										/>
										<Label htmlFor={`storage-${storage}`} className='cursor-pointer'>
											{storage}
										</Label>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Condition Slider - Show only when model and storage are selected */}
					{selectedModel && selectedStorage && (
						<div className='space-y-2'>
							<Label htmlFor='condition'>Độ mới của máy (%)</Label>
							<div className='flex items-center space-x-4'>
								<Slider id='condition' min={50} max={99} step={1} value={[conditionPercentage]} onValueChange={(value) => setConditionPercentage(value[0])} className='flex-1' />
								<span className='min-w-[40px] text-right font-medium'>{conditionPercentage}%</span>
							</div>
							<p className='text-sm text-muted-foreground'>Chọn độ mới ước tính của máy (50% - 99%).</p>
						</div>
					)}

					{/* Loan Ratio Input */}
					<div className='space-y-2'>
						<Label htmlFor='loanRatio'>Tỷ lệ cầm (%)</Label>
						<Input id='loanRatio' type='number' value={loanRatio} onChange={(e) => setLoanRatio(Math.max(0, Math.min(100, Number(e.target.value))))} placeholder='30' min='0' max='100' />
						<p className='text-sm text-muted-foreground'>Tỷ lệ phần trăm giá trị máy được cho vay (thường 30%).</p>
					</div>

					{/* Loan Months Input */}
					<div className='space-y-2'>
						<Label htmlFor='loanMonths'>Số tháng vay</Label>
						<Input id='loanMonths' type='number' value={loanMonths} onChange={(e) => setLoanMonths(Math.max(1, Number(e.target.value)))} placeholder='Nhập số tháng' min='1' />
					</div>

					{/* Interest Rate Input */}
					{/* <div className='space-y-2'>
						<Label htmlFor='interestRate'>Lãi suất tháng (%)</Label>
						<Input id='interestRate' type='number' step='0.1' value={interestRate} onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))} placeholder='Nhập lãi suất %' min='0' />
						<p className='text-sm text-muted-foreground'>Lãi suất tính theo tháng.</p>
					</div> */}
				</CardContent>
				<CardFooter className='flex flex-col items-start space-y-2 border-t pt-4'>
					<h3 className='font-semibold'>Kết quả ước tính:</h3>
					{marketPrice > 0 ? (
						<>
							<p>
								Giá tham khảo (theo độ mới {conditionPercentage}%): <span className='font-medium'>{formatCurrency(marketPrice)}</span>
							</p>
							<p>
								Gốc vay ước tính: <span className='font-medium'>{formatCurrency(loanPrincipal)}</span>
							</p>
							<p>
								Chi phí vay (lãi) ước tính: <span className='font-medium'>{formatCurrency(loanCost)}</span>
							</p>
							<p className='font-bold'>
								Tổng thanh toán ước tính: <span className='font-bold'>{formatCurrency(totalPayment)}</span>
							</p>
						</>
					) : (
						<p className='text-muted-foreground'>Vui lòng chọn dòng máy và dung lượng để xem ước tính.</p>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
