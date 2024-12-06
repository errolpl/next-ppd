"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

// Define the type for your Supabase table
type Book = {
	total_pages: number
	end_date: string
}

export default function SupabaseTest() {
	const [data, setData] = useState<Book[] | null>(null) // Use Book[] for rows
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Query the "books" table with proper typing
				const { data: books, error } = await supabase
					.from("books") // Table name as string
					.select("*") // Select all fields
					.returns<Book[]>() // Explicitly enforce the result type

				if (error) throw error

				// Update state with fetched data
				setData(books ?? []) // Ensure `data` is never null
			} catch (err) {
				setError((err as Error).message) // Properly type the error
			}
		}

		fetchData()
	}, [])

	if (error) return <div>Error: {error}</div>
	if (!data) return <div>Loading...</div>

	return (
		<div>
			<h1>Supabase Data:</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	)
}
