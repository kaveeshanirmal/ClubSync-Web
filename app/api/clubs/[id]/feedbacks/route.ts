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

