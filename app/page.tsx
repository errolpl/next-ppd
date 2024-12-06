"use client"

import { useState, useEffect } from "react"
import supabase from "@/lib/supabaseClient"
import BookInfo from "./components/BookInfo"
import PageCalc from "./components/PageCalc"

export default function Home() {
	const [bookId, setBookId] = useState<string | null>(null)
	const [totalPages, setTotalPages] = useState<number | null>(null)
	const [endDate, setEndDate] = useState<string | null>(null)

	const fetchBookInfo = async () => {
		try {
			const { data, error } = await supabase.from("books").select("id, total_pages, end_date").single()

			if (error) throw error

			setBookId(data.id)
			setTotalPages(data.total_pages)
			setEndDate(data.end_date)
		} catch (err) {
			console.error("Error fetching book info:", err)
		}
	}

	useEffect(() => {
		fetchBookInfo()
	}, [])

	return (
		<main className="min-h-screen bg-gray-900 text-white p-6">
			<BookInfo fetchBookInfo={fetchBookInfo} totalPages={totalPages} endDate={endDate} bookId={bookId} />
			<PageCalc totalPages={totalPages} endDate={endDate} />
		</main>
	)
}
