import { NextRequest, NextResponse } from "next/server";
import { getBibliography, loadMarkdown, deleteMarkdown } from "@/lib/pgvector/utils";
import PDFToMarkdown from "pdf2md-ts";

export async function GET() {
    try {
        const data = await getBibliography();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: "Error fetching bibliography" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const author = formData.get("author") as string;
        const description = formData.get("description") as string;

        const arrayBuffer = await file.arrayBuffer();
        const markdownArray = await PDFToMarkdown(arrayBuffer);
        const markdownContent = markdownArray.join("\n\n");

        const updatedBibliography = await loadMarkdown(markdownContent, title, author, description);
        return NextResponse.json(updatedBibliography);
    } catch (err) {
        console.error(err);

        return NextResponse.json({ error: "Error adding document" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        const updatedBibliography = await deleteMarkdown(id);
        return NextResponse.json(updatedBibliography);
    } catch (err) {
        return NextResponse.json({ error: "Error deleting document" }, { status: 500 });
    }
}
