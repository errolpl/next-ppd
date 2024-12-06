"use client"

import { useState } from "react"
import supabase from "@/lib/supabaseClient"

interface BookInfoProps {
	fetchBookInfo: () => Promise<void>
	totalPages: number | null
	endDate: string | null
	bookId: string | null // Add bookId as a prop
}

export default function BookInfo({ fetchBookInfo, totalPages, endDate, bookId }: BookInfoProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [newTotalPages, setNewTotalPages] = useState<number | "">(totalPages || "")
	const [newEndDate, setNewEndDate] = useState<string | "">(endDate || "")
	const [message, setMessage] = useState<string | null>(null)

	const openModal = () => {
		setNewTotalPages(totalPages || "")
		setNewEndDate(endDate || "")
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setMessage(null)
	}

	const updateBookInfo = async (event: React.FormEvent) => {
		event.preventDefault()

		if (!bookId) {
			setMessage("Error: Book ID not found.")
			return
		}

		try {
			const payload = {
				total_pages: newTotalPages || null,
				end_date: newEndDate || null,
			}

			console.log("Payload:", payload) // Debugging: log payload

			const { data, error } = await supabase.from("books").update(payload).eq("id", bookId) // Ensure you're updating the correct row

			console.log("Supabase response:", { data, error }) // Debugging: log response

			if (error) {
				console.error("Error updating book info:", error.message)
				setMessage("Failed to update book information.")
				return
			}

			setMessage("Book information updated successfully!")
			await fetchBookInfo() // Refresh the updated book info
			closeModal() // Close the modal
		} catch (err) {
			console.error("Unhandled error during update:", err)
			setMessage("Unexpected error occurred.")
		}
	}

	return (
		<div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
			<h2 className="text-xl font-bold mb-4">Book Info</h2>
			<p>Total Pages: {totalPages || "Loading..."}</p>
			<p>End Date: {endDate || "Loading..."}</p>
			<button onClick={openModal} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4">
				Update Book Info
			</button>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-gray-800 text-white rounded-lg p-6 shadow-lg max-w-md w-full">
						<h2 className="text-xl font-bold mb-4">Update Book Info</h2>

						<form onSubmit={updateBookInfo}>
							<div className="mb-4">
								<label htmlFor="totalPages" className="block text-sm font-medium text-gray-200 mb-1">
									Total Pages
								</label>
								<input
									type="number"
									id="totalPages"
									value={newTotalPages}
									onChange={e => setNewTotalPages(e.target.value ? parseInt(e.target.value, 10) : "")}
									className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="endDate" className="block text-sm font-medium text-gray-200 mb-1">
									End Date
								</label>
								<input
									type="date"
									id="endDate"
									value={newEndDate}
									onChange={e => setNewEndDate(e.target.value)}
									className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="flex justify-end">
								<button type="button" onClick={closeModal} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md mr-2">
									Cancel
								</button>
								<button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
									Submit
								</button>
							</div>
						</form>

						{message && <p className="text-sm mt-4 text-center">{message}</p>}
					</div>
				</div>
			)}
		</div>
	)
}
