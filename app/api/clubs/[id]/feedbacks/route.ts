import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(_: Request, { params }: { params: { id: string } }) {
	const clubId = params.id;
	try {
			const p = prisma as any;
			const feedbacks = await p.feedback.findMany({
				where: { clubId },
				orderBy: { createdAt: "desc" },
			});
		return NextResponse.json(feedbacks);
	} catch (err) {
		console.error("Failed to fetch feedbacks", err);
		return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
	}
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
	const clubId = params.id;
	try {
		const body = await request.json().catch(() => ({}));
		const { userId = null, rating, comment } = body as any;

		// Basic validation
		const parsedRating = Number(rating);
		if (!comment || typeof comment !== 'string' || !comment.trim()) {
			return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
		}
		if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
			return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
		}

		const p = prisma as any;
		const created = await p.feedback.create({
			data: {
				clubId,
				userId: userId || null,
				rating: parsedRating,
				comment: comment.trim(),
			},
		});

		return NextResponse.json(created, { status: 201 });
	} catch (err) {
		console.error('Failed to create feedback', err);
		return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
	}
}

