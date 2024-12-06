"use client"

import { useState, useEffect } from "react"

interface PageCalcProps {
	totalPages: number | null
	endDate: string | null
}

export default function PageCalc({ totalPages, endDate }: PageCalcProps) {
	const [currentPage, setCurrentPage] = useState<number | "">("")
	const [pagesPerDay, setPagesPerDay] = useState<number | string | null>(null)
	const [pagesLeft, setPagesLeft] = useState<number | null>(null)

	useEffect(() => {
		// Reset calculation whenever totalPages or endDate updates
		setCurrentPage("")
		setPagesPerDay(null)
		setPagesLeft(null)
	}, [totalPages, endDate])

	const calculatePagesPerDay = (event: React.FormEvent) => {
		event.preventDefault()

		if (typeof totalPages !== "number" || !endDate) {
			setPagesPerDay("Book information not available.")
			setPagesLeft(null)
			return
		}

		const today = new Date()
		const targetDate = new Date(endDate)

		if (isNaN(targetDate.getTime()) || targetDate <= today) {
			setPagesPerDay("Invalid or past end date.")
			setPagesLeft(null)
			return
		}

		const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
		const remainingPages = totalPages - (currentPage || 0)

		if (remainingPages <= 0) {
			setPagesPerDay("No pages left to read!")
			setPagesLeft(0)
		} else {
			setPagesPerDay(Math.ceil(remainingPages / daysRemaining))
			setPagesLeft(remainingPages)
		}
	}

	return (
		<div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
			<h2 className="text-xl font-bold mb-4">Pages Per Day</h2>
			<form onSubmit={calculatePagesPerDay} className="mb-4">
				<label htmlFor="currentPage" className="block mb-2">
					Current Page
				</label>
				<input
					type="number"
					id="currentPage"
					value={currentPage}
					onChange={e => setCurrentPage(e.target.value ? parseInt(e.target.value, 10) : "")}
					className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter the page number you're on"
				/>

				<button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
					Calculate
				</button>
			</form>
			{pagesPerDay !== null && <p>Pages Per Day: {pagesPerDay}</p>}
			{pagesLeft !== null && <p>Total Pages Left: {pagesLeft}</p>}
		</div>
	)
}
