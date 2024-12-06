"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

// Define the type for your Supabase table
type Book = {
	total_pages: number
	end_date: string
}

export default function SupabaseTest() {
	const [data, setData] = useState<Book[] | null>(null) // Use Book[] for array of rows
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Query the "books" table
				const { data, error } = await supabase
					.from<Book>("books") // Specify row type
					.select("*")

				if (error) throw error

				// Ensure the data is properly typed
				setData(data ?? [])
			} catch (err) {
				setError((err as Error).message) // Narrow the error type to Error
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
