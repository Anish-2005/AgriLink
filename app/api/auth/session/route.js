// Minimal session route handler to satisfy Next.js app route requirements.
// Returns a JSON object with `user: null` when no session is available.
export async function GET(req) {
	try {
		const body = { user: null };
		return new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

