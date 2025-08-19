import { NextRequest, NextResponse } from "next/server";
import { getBibliography, loadMarkdown, deleteMarkdown } from "@/lib/pgvector/utils";
import FormData from "form-data";
import axios from "axios";

async function convertPdfToMarkdown(buffer: Buffer<ArrayBuffer>) {
    const formData = new FormData();

    const instructions = {
        parts: [
            {
                file: "file",
            },
        ],
        output: {
            type: "markdown",
        },
    };

    formData.append("instructions", JSON.stringify(instructions));
    formData.append("file", buffer);

    try {
        const response = await axios.post("https://api.nutrient.io/build", formData, {
            headers: {
                Authorization: "Bearer "+ process.env.NUTRIENT_API_KEY,
            },
            responseType: "text",
        });

        const resultString: string = response.data;
        console.log(resultString);
        return resultString;
    } catch (error) {
        console.error("Error convirtiendo el archivo PDF a Markdown", error);
        console.error(error);
        throw new Error(
            "Error converting PDF to Markdown"
        )
    }
}

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
        const buffer = Buffer.from(arrayBuffer);
        const markdownContent = await convertPdfToMarkdown(buffer);
        if(!markdownContent || markdownContent.length<1) throw new Error(
            "Error converting PDF to Markdown"
        )

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
