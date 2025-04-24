'use client'

import * as React from 'react'

export function ImportantNotes() {
	return (
		<div className='w-full pt-4 text-sm text-muted-foreground space-y-1'>
			<p className='font-semibold text-foreground pt-2'>✅ Lưu ý quan trọng trong hợp đồng vay:</p>
			<p className='pl-4 font-semibold'>📌 Phí phạt khi chậm trả góp:</p>
			<ul className='list-disc pl-10 space-y-1'>
				<li>+10% trên số tiền chậm cho ngày chậm đầu tiên</li>
				<li>+20% trên số tiền chậm cho ngày chậm thứ 06</li>
				<li>+30% trên số tiền chậm cho ngày chậm thứ 11</li>
				<li>Không quá 03 lần/kỳ đóng lãi phí (giới hạn số lần phạt)</li>
			</ul>
			<p className='pl-4 font-semibold'>📌 Phạt khi thanh lý hợp đồng trước hạn:</p>
			<ul className='list-disc pl-10 space-y-1'>
				<li>08% trên tổng số dư nợ gốc còn lại</li>
				<li>Bên A có trách nhiệm thanh toán toàn bộ lãi phí của kỳ hiện tại.</li>
			</ul>
		</div>
	)
}
