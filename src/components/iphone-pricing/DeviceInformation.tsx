'use client'

import * as React from 'react'
import {Check, ChevronsUpDown} from 'lucide-react'

import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command'
import {Label} from '@/components/ui/label'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Slider} from '@/components/ui/slider'

interface DeviceInformationProps {
	models: string[]
	availableStorages: string[]
	selectedModel: string
	setSelectedModel: (model: string) => void
	selectedStorage: string
	setSelectedStorage: (storage: string) => void
	conditionPercentage: number
	setConditionPercentage: (percentage: number) => void
	modelPopoverOpen: boolean
	setModelPopoverOpen: (open: boolean) => void
}

export function DeviceInformation({models, availableStorages, selectedModel, setSelectedModel, selectedStorage, setSelectedStorage, conditionPercentage, setConditionPercentage, modelPopoverOpen, setModelPopoverOpen}: DeviceInformationProps) {
	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold'>Thông tin máy</h3>
			{/* Model Selection with Search */}
			<div className='space-y-2'>
				<Label>Dòng máy iPhone</Label>
				<Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
					<PopoverTrigger asChild>
						<Button variant='outline' role='combobox' aria-expanded={modelPopoverOpen} className='w-full justify-between'>
							{selectedModel ? models.find((model) => model === selectedModel) : 'Chọn dòng máy...'}
							<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0'>
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
												// Find the actual model name corresponding to the value (which might be lowercased by Command)
												const matchedModel = models.find((m) => m.toLowerCase() === currentValue.toLowerCase()) || ''
												setSelectedModel(matchedModel === selectedModel ? '' : matchedModel)
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

			{/* Storage Selection with Buttons */}
			{selectedModel && (
				<div className='space-y-2'>
					<Label>Dung lượng</Label>
					<div className='flex flex-wrap gap-2'>
						{availableStorages.map((storage) => (
							<Button
								key={storage}
								variant={selectedStorage === storage ? 'default' : 'outline'}
								size='sm'
								onClick={() => {
									setSelectedStorage(selectedStorage === storage ? '' : storage)
								}}>
								{storage}
							</Button>
						))}
					</div>
				</div>
			)}

			{/* Condition Slider */}
			{selectedModel && selectedStorage && (
				<div className='space-y-2'>
					<Label htmlFor='condition'>Độ mới</Label>
					<div className='flex items-center space-x-4'>
						<Slider id='condition' min={50} max={99} step={1} value={[conditionPercentage]} onValueChange={(value) => setConditionPercentage(value[0])} className='flex-1' />
						<span className='min-w-[40px] text-right font-medium'>{conditionPercentage}%</span>
					</div>
				</div>
			)}
		</div>
	)
}
